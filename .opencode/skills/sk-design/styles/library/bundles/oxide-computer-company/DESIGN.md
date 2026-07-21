# Oxide Computer Company — Style Reference
> Datacenter rack at midnight with one green LED lit

**Theme:** dark

Oxide uses a terminal-grade infrastructure language: near-black canvas, razor-thin 1px hairlines, monospace labels that read like CLI output, and a single vivid green that behaves like an LED status indicator rather than a marketing accent. The site treats its own interface the way it treats its racks — exposed, functional, and free of decoration. Everything technical (tabs, badges, nav items, code, system labels) renders in GT America Mono at small sizes with wide tracking; everything human (headlines, body, marketing copy) uses SuisseIntl at comfortable sizes with tight tracking. Color is rationed: green only signals active/initialized/selected states, while magenta-tinted status lines (like 'STATUS ERROR') hint at secondary diagnostics. Surfaces are nearly flat — inset 1px strokes instead of drop shadows, no rounded corners on structural elements, and a surface stack that moves from true black through charcoal to deep teal rather than the usual gray ramp.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Void Black | `#0b0e12` | `--color-void-black` | Page canvas, deepest background layer — absorbs everything below the fold |
| Carbon | `#181a1d` | `--color-carbon` | Card surfaces, terminal mockup backgrounds, badge fill |
| Graphite | `#1f2124` | `--color-graphite` | Elevated surface, nested panel backgrounds, subtle border against carbon |
| Slate Base | `#303235` | `--color-slate-base` | Dominant neutral — body text borders, hairlines, icon strokes, grid line color (appears 5,900+ times as borderColor) |
| Fog | `#5d5e61` | `--color-fog` | Muted body text, secondary labels, disabled helper text |
| Steel | `#818284` | `--color-steel` | Tertiary text, icon outlines, inactive nav items |
| Ash | `#a3a4a5` | `--color-ash` | Secondary text, link text at rest, footer copy |
| Silver | `#bababb` | `--color-silver` | Primary UI text, nav items, body copy at default weight |
| Bone | `#dedede` | `--color-bone` | Headline color, high-emphasis text, display copy — the lightest ink in the system |
| Phosphor Green | `#00d892` | `--color-phosphor-green` | Green accent for outlined action borders, linked labels, and lightweight interactive emphasis. Do not promote it to the primary CTA color |
| Deep Teal | `#002923` | `--color-deep-teal` | Filled CTA background, button fill, badge background — the only chromatic fill in the interface, reserved for primary action surfaces |
| Emerald Depth | `#005441` | `--color-emerald-depth` | Hover/active state for deep teal surfaces, decorative green wash in body copy contexts, large-area green-tinted backgrounds |
| Diagnostic Magenta | `#9f3f53` | `--color-diagnostic-magenta` | Red text accent for links, tags, and emphasized short phrases. Use as a supporting accent, not as a status color |
| Syntax Violet | `#c58aff` | `--color-syntax-violet` | Violet text accent for links, tags, and emphasized short phrases. Use as a supporting accent, not as a status color |
| Syntax Coral | `#ff6285` | `--color-syntax-coral` | Red text accent for links, tags, and emphasized short phrases. Use as a supporting accent, not as a status color |
| Syntax Forest | `#006d4a` | `--color-syntax-forest` | Green text accent for links, tags, and emphasized short phrases. Use as a supporting accent, not as a status color |

## Tokens — Typography

### SuisseIntl — Primary interface typeface — body copy, headlines, nav items, hero text, footer. Weight 400 is the only weight used, which forces typographic hierarchy to come from size and tracking rather than bold weight. Display sizes (50–65px) use negative tracking (-0.005em to -0.003em) to tighten the headlines; small sizes (11–12px) use positive tracking (0.044–0.053em) to open up labels. · `--font-suisseintl`
- **Substitute:** Inter, Helvetica Neue, system-ui
- **Weights:** 400
- **Sizes:** 11, 12, 14, 16, 18, 20, 25, 36, 50, 65
- **Line height:** 1.10, 1.17, 1.28, 1.29, 1.30, 1.33, 1.35, 1.38
- **Letter spacing:** -0.005em at 65px, -0.003em at 50px, 0.044em at 11px, 0.053em at 12px
- **OpenType features:** `"calt" 0, "ss02", "ss03", "ss06", "ss07", "ss08", "ss09"`
- **Role:** Primary interface typeface — body copy, headlines, nav items, hero text, footer. Weight 400 is the only weight used, which forces typographic hierarchy to come from size and tracking rather than bold weight. Display sizes (50–65px) use negative tracking (-0.005em to -0.003em) to tighten the headlines; small sizes (11–12px) use positive tracking (0.044–0.053em) to open up labels.

### GT America Mono — Technical labels, tab names (CLI, API, CONSOLE), badge text, button labels, nav annotations, code blocks, metadata. Wide positive tracking (0.014–0.064em) at all sizes gives the typeface a 'system readout' quality. The 'calt' 0 setting deliberately disables contextual alternates so the monospace grid stays rigid — this is mono as system chrome, not mono as code. · `--font-gt-america-mono`
- **Substitute:** JetBrains Mono, IBM Plex Mono, Roboto Mono
- **Weights:** 400
- **Sizes:** 10, 11, 12, 13, 20
- **Line height:** 1.00, 1.20, 1.25, 1.30, 1.33, 1.40, 1.45, 1.60
- **Letter spacing:** 0.014em at 20px, 0.053em at 12px, 0.058em at 11px, 0.064em at 10px
- **OpenType features:** `"calt" 0, "ss02", "ss03", "ss06", "ss07", "ss08", "ss09"`
- **Role:** Technical labels, tab names (CLI, API, CONSOLE), badge text, button labels, nav annotations, code blocks, metadata. Wide positive tracking (0.014–0.064em) at all sizes gives the typeface a 'system readout' quality. The 'calt' 0 setting deliberately disables contextual alternates so the monospace grid stays rigid — this is mono as system chrome, not mono as code.

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 10px | 1.6 | 0.64px | `--text-caption` |
| body | 14px | 1.38 | — | `--text-body` |
| subheading | 20px | 1.3 | 0.28px | `--text-subheading` |
| heading-sm | 25px | 1.28 | 0.5px | `--text-heading-sm` |
| heading | 36px | 1.17 | — | `--text-heading` |
| display | 65px | 1.1 | -0.33px | `--text-display` |

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
| 36 | 36px | `--spacing-36` |
| 40 | 40px | `--spacing-40` |
| 48 | 48px | `--spacing-48` |
| 56 | 56px | `--spacing-56` |
| 60 | 60px | `--spacing-60` |
| 64 | 64px | `--spacing-64` |
| 80 | 80px | `--spacing-80` |
| 128 | 128px | `--spacing-128` |

### Border Radius

| Element | Value |
|---------|-------|
| nav | 1px |
| cards | 1px |
| badges | 1px |
| inputs | 1px |
| buttons | 1px |

### Shadows

| Name | Value | Token |
|------|-------|-------|
| subtle | `oklab(0.77 -0.184187 0.0538599 / 0.15) 0px 0px 0px 1px inset` | `--shadow-subtle` |
| subtle-2 | `oklab(0.79 -0.000191013 -0.00108329 / 0.15) 0px 0px 0px 1...` | `--shadow-subtle-2` |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 80px
- **Card padding:** 20px
- **Element gap:** 12px

## Components

### Filled Primary Button
**Role:** Primary action — the only filled chromatic button in the system

Background #002923 (Deep Teal), text in Phosphor Green (#00d892) at 12px GT America Mono, weight 400, letter-spacing 0.053em. Padding 6px 12px. Border 1px solid #002923. Radius 1px. No shadow. This button reads as a status indicator that happens to be clickable, not a marketing CTA.

### Outlined Ghost Button
**Role:** Secondary action — used for 'TRY NOW' in the nav

Transparent background, 1px border in Silver (#bababb) or Ash (#a3a4a5), text in matching color at 12px GT America Mono, tracking 0.053em. Padding 6px 12px. Radius 1px. On hover, border and text shift to Bone (#dedede).

### Text Link Button
**Role:** Tertiary action or inline link

No background, no border. Text in Ash (#a3a4a5) at 14px SuisseIntl, no underline. On hover, text shifts to Bone (#dedede). Used for navigation-level CTAs and inline references.

### Terminal Mockup Panel
**Role:** Product capability demo — shows the CLI/API experience

Background #181a1d (Carbon). 1px border in Slate (#303235). Internal tab bar with monospace labels (CLI, API, CONSOLE) in 12px GT America Mono, tracking 0.053em. Active tab has Phosphor Green (#00d892) text with a 1px green underline. Body contains monospace code lines in 13px GT America Mono with syntax coloring (green prompts, violet keys, coral values, green-300 comments). Radius 1px. No shadow — relies on border and background contrast.

### Status Badge
**Role:** System state indicator — 'INITIALIZED', 'POWERING THE BEST TEAMS'

Background Carbon (#181a1d) with a 1px inset stroke in Phosphor Green (#00d892) at 15% opacity. Text in Phosphor Green at 10–11px GT America Mono, tracking 0.064em, uppercase. Padding 1–2px vertical, 6–12px horizontal. Radius 1px. The inset green ring is the badge's signature — it looks like an LED housing, not a pill.

### Navigation Link
**Role:** Top-nav items (PRODUCT, SOLUTIONS, RESOURCES, COMPANY, PODCASTS, BLOG)

12px GT America Mono, weight 400, tracking 0.053em, uppercase. Color Silver (#bababb) at rest, Bone (#dedede) on hover. Chevron indicators in matching color. No background, no border, no underline. Items sit on the dark canvas with 20–24px horizontal spacing.

### Comparison Grid Diagram
**Role:** Side-by-side comparison block (Traditional on-prem vs Public cloud)

Two equal-width panels separated by a 1px Slate (#303235) vertical divider. Each panel uses dashed 1px Slate borders to form a technical floorplan-style grid. Accent lines in Phosphor Green (#00d892) and Diagnostic Magenta (#9f3f53) trace paths through the grid. The magenta path terminates in a 'STATUS ERROR 0x42B-0W' label in monospace. Below each diagram, a bullet list in 14px SuisseIntl with bold-400 lead-ins (the 400 weight reads as emphasis here).

### Hero Headline
**Role:** Primary page headline

SuisseIntl weight 400 at 50–65px, color Bone (#dedede), line-height 1.10, letter-spacing -0.005em to -0.003em. No bold, no italic — size and tight tracking do the work. Sits in the lower-left third of the hero, leaving the right side for the product render.

### Product Render Frame
**Role:** Server rack / data center photography placement

Full-bleed or large-aspect photographic composition with no border, no radius, no frame treatment. Green LED indicators on the rack hardware echo the Phosphor Green brand color, making the product photography itself act as brand identity. Caption labels in 10–11px GT America Mono with figure numbers (e.g., 'FIG. 1 OXIDE CLOUD COMPUTER').

### CLI Prompt Card
**Role:** Standalone command-line callout with green action state

Carbon (#181a1d) background. Two-line layout: top line shows 'Rack 6' label in Silver 12px SuisseIntl with 'INITIALIZED' in Phosphor Green GT America Mono at the right. Bottom line is a full-width green button bar (#002923) with 'SIGN IN WITH SSO' in Phosphor Green 12px GT America Mono. Radius 1px. 1px Slate border.

### Section Heading
**Role:** H2-level section opener

SuisseIntl weight 400 at 36px, color Bone (#dedede), line-height 1.17, no letter-spacing adjustment. Left-aligned, max-width ~700px. No decorative element above or beside it — the type is the section marker.

### Footer Link Column
**Role:** Standard footer navigation

SuisseIntl 14px weight 400, color Steel (#818284) for column headers, Ash (#a3a4a5) for links. 12px row gap. No separators, no borders. On a #181a1d background.

### Logo Mark
**Role:** Brand identifier in nav

Wordmark 'oxide' in lowercase, 20px SuisseIntl weight 400 with a custom '@' character replaced by a green glyph or the 'o' rendered in Phosphor Green (#00d892). The rest of the wordmark is Bone (#dedede) or Silver. No tagline, no container.

### Customer Logo Strip
**Role:** Social proof — 'POWERING THE BEST TEAMS'

Single-row horizontal strip of partner logos in grayscale (rendered in Fog #5d5e61 or Steel #818284 on dark canvas). Logos separated by generous whitespace (40–60px gaps), no dividers. Label above strip in 10–11px GT America Mono, tracking 0.064em, uppercase, color Steel.

## Do's and Don'ts

### Do
- Use #002923 (Deep Teal) as the only filled button background; pair it with #00d892 (Phosphor Green) text in GT America Mono 12px
- Set border-radius to 1px on all buttons, badges, inputs, cards, and nav items — never use 4px or higher on structural elements
- Use GT America Mono 10–12px with tracking 0.053–0.064em for every technical label, tab, badge, and button
- Step surfaces by color (Void → Carbon → Graphite) and by 1px Slate borders; never use drop shadows to create elevation
- Use the surface stack #0b0e12 → #181a1d → #1f2124 in that order for base → card → elevated panels
- Set headlines in SuisseIntl 50–65px weight 400 with negative tracking (-0.005em to -0.003em); let size do the work instead of bold weight
- Reserve Phosphor Green (#00d892) for active states, logo, and status indicators — never as a decorative accent or large fill

### Don't
- Do not use border-radius above 1px on buttons, badges, cards, or nav — the sharp edges are signature
- Do not use drop shadows for elevation; the system communicates depth through surface color stepping and 1px inset strokes only
- Do not apply bold (600+) or semibold weight — Oxide runs entirely on weight 400 across both typefaces
- Do not use Phosphor Green (#00d892) as a background fill, page section background, or large decorative area
- Do not use diagnostic magenta (#9f3f53) for user-facing alerts, form errors, or destructive action buttons — it is a terminal-readout color, not an error UI color
- Do not center body text or stack headlines in centered compositions — Oxide reads left-aligned with a generous left margin
- Do not use rounded photographic treatments, blur effects, or gradient overlays on product renders — hardware photography is presented raw with no border or radius

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Void | `#0b0e12` | Page canvas — the deepest background, used for full-bleed sections |
| 1 | Carbon | `#181a1d` | Card surfaces, terminal mockup panels, badge fills |
| 2 | Graphite | `#1f2124` | Nested panels, elevated content blocks, link backgrounds |
| 3 | Slate | `#303235` | Hairline border color, structural dividers, the dominant neutral |

## Elevation

- **Status Badge:** `inset 0 0 0 1px oklab(0.77 -0.184 0.054 / 0.15)`
- **Status Badge (neutral variant):** `inset 0 0 0 1px oklab(0.79 -0.0002 -0.001 / 0.15)`

## Imagery

Imagery is minimal and product-focused. The dominant visual is large-format photography of Oxide's rack-scale hardware in data center environments, shot in high-contrast near-monochrome with green LED accents that echo the brand color. The hardware IS the hero — no lifestyle context, no people, no abstraction. Secondary imagery includes screen captures of the Oxide UI (terminal mockups, dashboard panels) that look like real product screenshots rather than marketing renders. The comparison section uses technical line-art diagrams (dashed grids with traced paths) rather than photography. There is no decorative illustration layer, no abstract gradient backgrounds, and no icon set beyond a small set of monoline chevrons and arrows. The radial gradient detected in the data (oklch 0.483 → oklch 0.247) is used only as a subtle vignette behind hero compositions, not as a graphic element.

## Layout

Page is full-bleed with a 1200px content max-width centered on the dark canvas. The hero is asymmetric: a 5/12-width terminal mockup in the top-left, a 7/12-width product render filling the right side, and the headline anchored to the lower-left quadrant. This split is maintained as a recurring motif. Below the hero, sections use a consistent rhythm: full-width dark band, centered 1200px content, 80px vertical padding between bands. The comparison section breaks the single-column flow into a 2-column grid with a 1px vertical divider down the center. Lists and feature blocks are left-aligned with generous left margin rather than centered. Navigation is a minimal top bar — logo left, 5 nav items center, 2 CTAs right — with no sticky behavior and no background fill (it sits on the page canvas directly). There is no sidebar, no mega-menu, and no breadcrumb. Density is comfortable: large blocks of negative space between sections, single-column body text at a readable measure (~660px), and no information-dense table layouts.

## Agent Prompt Guide

**Quick Color Reference**
- background: #0b0e12
- surface (card): #181a1d
- surface (elevated): #1f2124
- text (headline): #dedede
- text (body): #bababb
- text (muted): #818284
- border: #303235
- accent / active: #00d892
- primary action: #002923 (filled action)

**3–5 Example Component Prompts**

1. *Build a hero section:* Background #0b0e12. Headline 'On-prem that feels like the public cloud' in SuisseIntl 65px weight 400, color #dedede, letter-spacing -0.33px, line-height 1.10. Subtitle in SuisseIntl 18px weight 400, color #818284. A terminal mockup panel sits top-left: #181a1d background, 1px #303235 border, 1px radius. Inside, tab labels (CLI, API, CONSOLE) in GT America Mono 12px weight 400, tracking 0.64px, color #bababb; active tab 'CLI' in #00d892 with a 1px #00d892 underline. Code body in GT America Mono 13px, with green prompts (#00d892) and silver text (#bababb). A large product render of a server rack fills the right 60% of the hero, full-bleed, no border or radius.

2. *Build a status badge:* Background #181a1d. Inset 1px stroke at 15% opacity in Phosphor Green (#00d892). Text 'INITIALIZED' in GT America Mono 10px weight 400, tracking 0.64px, uppercase, color #00d892. Padding 2px 8px. Radius 1px.

3. *Build a filled primary action: #002923 (filled action)

4. *Build a comparison grid diagram:* Two equal panels side by side, separated by a 1px vertical line in #303235. Each panel contains a grid of dashed 1px #303235 lines forming a floorplan-style block. A traced path in Phosphor Green (#00d892) runs through the left panel; a similar path in Diagnostic Magenta (#9f3f53) runs through the right panel and terminates in a 'STATUS ERROR' label in GT America Mono 11px, tracking 0.58px, color #9f3f53. Below each diagram, a bullet list in SuisseIntl 14px weight 400, color #bababb, with 8px row gap.

5. *Build a customer logo strip:* Single horizontal row of grayscale partner logos on the #0b0e12 canvas. Logos rendered in #5d5e61 (Fog). 48px horizontal gap between logos. Above the strip, a label 'POWERING THE BEST TEAMS' in GT America Mono 10px weight 400, tracking 0.64px, uppercase, color #818284. 20px gap between label and logos.

## Color Rationing Rules

Phosphor Green (#00d892) is rationed to three functions: (1) active/initialized/selected state, (2) the logo mark, and (3) text on filled teal buttons. It should never appear as a background fill, never as a border on a non-status element, and never as decorative accent in body copy. Deep Teal (#002923) is the only chromatic fill surface and should be used for one or two primary actions per page maximum. Diagnostic Magenta (#9f3f53) is the system's 'red' but it reads as a terminal error readout, not a user-facing alert — use it only in CLI mockups, diagram annotations, and code contexts.

## Typography Pairing Logic

SuisseIntl handles everything a human reads. GT America Mono handles everything a system says: tabs, badges, button labels, nav annotations, code, metadata, status lines, and figure captions. The decision rule: if the text could appear in a terminal or a serial number label, it goes in GT America Mono with wide tracking. If it could appear in a brochure, it goes in SuisseIntl. Never use GT America Mono for paragraphs longer than ~6 words. Never use SuisseIntl for technical labels under 14px.

## Similar Brands

- **Fly.io** — Same dark canvas with a single vivid accent color (Fly uses purple, Oxide uses green) and terminal-grade monospace UI labels for nav and tabs
- **Tailscale** — Dark-mode infrastructure product with sharp 1px borders, monochrome body text, and a single accent color used sparingly for active states
- **Cloudflare** — Same aesthetic of technical diagrams, dashed-line comparisons, and a palette that treats orange/cloud-color as a system status signal rather than decoration
- **Equinix** — Data center / infrastructure brand that uses raw hardware photography as the primary visual identity, with dark UI and green status indicators echoing LED racks

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-void-black: #0b0e12;
  --color-carbon: #181a1d;
  --color-graphite: #1f2124;
  --color-slate-base: #303235;
  --color-fog: #5d5e61;
  --color-steel: #818284;
  --color-ash: #a3a4a5;
  --color-silver: #bababb;
  --color-bone: #dedede;
  --color-phosphor-green: #00d892;
  --color-deep-teal: #002923;
  --color-emerald-depth: #005441;
  --color-diagnostic-magenta: #9f3f53;
  --color-syntax-violet: #c58aff;
  --color-syntax-coral: #ff6285;
  --color-syntax-forest: #006d4a;

  /* Typography — Font Families */
  --font-suisseintl: 'SuisseIntl', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-gt-america-mono: 'GT America Mono', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;

  /* Typography — Scale */
  --text-caption: 10px;
  --leading-caption: 1.6;
  --tracking-caption: 0.64px;
  --text-body: 14px;
  --leading-body: 1.38;
  --text-subheading: 20px;
  --leading-subheading: 1.3;
  --tracking-subheading: 0.28px;
  --text-heading-sm: 25px;
  --leading-heading-sm: 1.28;
  --tracking-heading-sm: 0.5px;
  --text-heading: 36px;
  --leading-heading: 1.17;
  --text-display: 65px;
  --leading-display: 1.1;
  --tracking-display: -0.33px;

  /* Typography — Weights */
  --font-weight-regular: 400;

  /* Spacing */
  --spacing-unit: 4px;
  --spacing-4: 4px;
  --spacing-8: 8px;
  --spacing-12: 12px;
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-36: 36px;
  --spacing-40: 40px;
  --spacing-48: 48px;
  --spacing-56: 56px;
  --spacing-60: 60px;
  --spacing-64: 64px;
  --spacing-80: 80px;
  --spacing-128: 128px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 80px;
  --card-padding: 20px;
  --element-gap: 12px;

  /* Border Radius */
  --radius-sm: 1px;
  --radius-md: 4px;
  --radius-full: 9999.01px;

  /* Named Radii */
  --radius-nav: 1px;
  --radius-cards: 1px;
  --radius-badges: 1px;
  --radius-inputs: 1px;
  --radius-buttons: 1px;

  /* Shadows */
  --shadow-subtle: oklab(0.77 -0.184187 0.0538599 / 0.15) 0px 0px 0px 1px inset;
  --shadow-subtle-2: oklab(0.79 -0.000191013 -0.00108329 / 0.15) 0px 0px 0px 1px inset;

  /* Surfaces */
  --surface-void: #0b0e12;
  --surface-carbon: #181a1d;
  --surface-graphite: #1f2124;
  --surface-slate: #303235;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-void-black: #0b0e12;
  --color-carbon: #181a1d;
  --color-graphite: #1f2124;
  --color-slate-base: #303235;
  --color-fog: #5d5e61;
  --color-steel: #818284;
  --color-ash: #a3a4a5;
  --color-silver: #bababb;
  --color-bone: #dedede;
  --color-phosphor-green: #00d892;
  --color-deep-teal: #002923;
  --color-emerald-depth: #005441;
  --color-diagnostic-magenta: #9f3f53;
  --color-syntax-violet: #c58aff;
  --color-syntax-coral: #ff6285;
  --color-syntax-forest: #006d4a;

  /* Typography */
  --font-suisseintl: 'SuisseIntl', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-gt-america-mono: 'GT America Mono', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;

  /* Typography — Scale */
  --text-caption: 10px;
  --leading-caption: 1.6;
  --tracking-caption: 0.64px;
  --text-body: 14px;
  --leading-body: 1.38;
  --text-subheading: 20px;
  --leading-subheading: 1.3;
  --tracking-subheading: 0.28px;
  --text-heading-sm: 25px;
  --leading-heading-sm: 1.28;
  --tracking-heading-sm: 0.5px;
  --text-heading: 36px;
  --leading-heading: 1.17;
  --text-display: 65px;
  --leading-display: 1.1;
  --tracking-display: -0.33px;

  /* Spacing */
  --spacing-4: 4px;
  --spacing-8: 8px;
  --spacing-12: 12px;
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-36: 36px;
  --spacing-40: 40px;
  --spacing-48: 48px;
  --spacing-56: 56px;
  --spacing-60: 60px;
  --spacing-64: 64px;
  --spacing-80: 80px;
  --spacing-128: 128px;

  /* Border Radius */
  --radius-sm: 1px;
  --radius-md: 4px;
  --radius-full: 9999.01px;

  /* Shadows */
  --shadow-subtle: oklab(0.77 -0.184187 0.0538599 / 0.15) 0px 0px 0px 1px inset;
  --shadow-subtle-2: oklab(0.79 -0.000191013 -0.00108329 / 0.15) 0px 0px 0px 1px inset;
}
```
