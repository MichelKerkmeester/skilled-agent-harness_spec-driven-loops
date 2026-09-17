# Ciridae — Style Reference
> void chamber with ember pulse — a near-black cathedral where the only warm note is a thin line of ember rust, and every surface is defined by hairline borders rather than shadow.

**Theme:** dark

Ciridae operates in a void: #0b0b0b canvas, ghost-outlined pill controls, and typography locked in uppercase Pragmatica Cond at weight 400 — no bold, no mixed case, no decoration. The only chromatic note is #cc6437, a warm ember rust used as hairline strokes and small accent punctuation, never as a fill. Cards float on #272a2a with 10px radius and zero shadow; the system refuses elevation, defining surfaces through tonal contrast and 1px hairline borders. Photography arrives heavily blurred and atmospheric — liquid marble, smoke, fire — set behind type at full-bleed scale, so the visuals feel ambient rather than illustrative.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Ember Rust | `#cc6437` | `--color-ember-rust` | Accent strokes, icon linework, small text highlights — the only chromatic color in an otherwise monochrome system, appearing as a hairline pulse rather than a fill |
| Void Black | `#0b0b0b` | `--color-void-black` | Primary page canvas and section backgrounds; the foundation of the entire system |
| Charcoal Surface | `#272a2a` | `--color-charcoal-surface` | Card and panel backgrounds on dark sections — one step lighter than the canvas to create surface separation without shadow |
| Bone | `#edebe7` | `--color-bone` | Light section backgrounds and off-white surfaces where the system flips from dark to bright |
| Bone Darker | `#dfddd9` | `--color-bone-darker` | Subtle variant of Bone for layered light surfaces and warm-tinted off-white elements |
| Pure White | `#ffffff` | `--color-pure-white` | All body and heading text, ghost button borders, nav elements — the dominant foreground color at 19.7:1 contrast on Void Black |
| Abyss | `#050505` | `--color-abyss` | Elevated bar backgrounds (top news strip) — one shade darker than the main canvas to push the bar forward |
| Steel | `#484848` | `--color-steel` | Mid-tone border for secondary solid buttons where Pure White would be too stark |
| Ash | `#cecece` | `--color-ash` | Hairline borders for pill badges and numbered markers — lighter than Steel to read as fine detail against the dark canvas |

## Tokens — Typography

### Pragmatica Cond — Primary display and UI typeface — narrow condensed uppercase at 14px for body, 20px for section labels, 32px for hero wordmark. The extreme narrowness and all-caps setting at 14px body size is the system's most signature choice: body text reads as a whisper of architectural type, not conventional prose. Substitute with Oswald or Barlow Condensed if Pragmatica Cond is unavailable. · `--font-pragmatica-cond`
- **Substitute:** Oswald, Barlow Condensed
- **Weights:** 400
- **Sizes:** 14px, 20px, 32px
- **Line height:** 1.00, 1.05, 1.43
- **Letter spacing:** -0.02em on all sizes
- **Role:** Primary display and UI typeface — narrow condensed uppercase at 14px for body, 20px for section labels, 32px for hero wordmark. The extreme narrowness and all-caps setting at 14px body size is the system's most signature choice: body text reads as a whisper of architectural type, not conventional prose. Substitute with Oswald or Barlow Condensed if Pragmatica Cond is unavailable.

### Pragmatica — Secondary body typeface used for longer-form prose passages (e.g. the 'AI Operating System' card description at 24px, paragraph text at 15px). Slightly wider than Pragmatica Cond for reading comfort in extended blocks, but still 400 weight — no bold ever. Substitute with Inter or Söhne. · `--font-pragmatica`
- **Substitute:** Inter, Söhne
- **Weights:** 400
- **Sizes:** 14px, 15px, 16px, 24px
- **Line height:** 0.90, 1.00, 1.10, 1.20, 1.25, 1.40
- **Letter spacing:** -0.02em at 24px, -0.01em at 15px
- **Role:** Secondary body typeface used for longer-form prose passages (e.g. the 'AI Operating System' card description at 24px, paragraph text at 15px). Slightly wider than Pragmatica Cond for reading comfort in extended blocks, but still 400 weight — no bold ever. Substitute with Inter or Söhne.

### Roboto Mono — Monospace micro-type for the top news bar ticker ('NEWS • JUN 15, 2026 • CRUCIBLE EARLY ACCESS IS NOW OPEN'). The only place monospace appears, creating a clear functional distinction: this is system data, not brand voice. · `--font-roboto-mono`
- **Substitute:** Roboto Mono (free, use as-is)
- **Weights:** 400
- **Sizes:** 11px, 14px
- **Line height:** 0.90, 1.00, 1.10, 1.20
- **Letter spacing:** -0.02em
- **Role:** Monospace micro-type for the top news bar ticker ('NEWS • JUN 15, 2026 • CRUCIBLE EARLY ACCESS IS NOW OPEN'). The only place monospace appears, creating a clear functional distinction: this is system data, not brand voice.

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 11px | 1.1 | -0.22px | `--text-caption` |
| body-sm | 14px | 1.43 | -0.28px | `--text-body-sm` |
| heading-sm | 20px | 1 | -0.4px | `--text-heading-sm` |
| heading | 24px | 1.2 | -0.48px | `--text-heading` |
| heading-lg | 32px | 1.05 | -0.64px | `--text-heading-lg` |

## Tokens — Spacing & Shapes

**Density:** comfortable

### Spacing Scale

| Name | Value | Token |
|------|-------|-------|
| 5 | 5px | `--spacing-5` |
| 7 | 7px | `--spacing-7` |
| 8 | 8px | `--spacing-8` |
| 10 | 10px | `--spacing-10` |
| 11 | 11px | `--spacing-11` |
| 16 | 16px | `--spacing-16` |
| 18 | 18px | `--spacing-18` |
| 20 | 20px | `--spacing-20` |
| 24 | 24px | `--spacing-24` |
| 30 | 30px | `--spacing-30` |
| 32 | 32px | `--spacing-32` |
| 40 | 40px | `--spacing-40` |
| 65 | 65px | `--spacing-65` |
| 80 | 80px | `--spacing-80` |
| 100 | 100px | `--spacing-100` |
| 122 | 122px | `--spacing-122` |

### Border Radius

| Element | Value |
|---------|-------|
| nav | 1440px |
| cards | 10px |
| badges | 1440px |
| buttons | 1440px |
| news-bar-button | 0px |

### Layout

- **Page max-width:** 1400px
- **Section gap:** 80px
- **Card padding:** 32px
- **Element gap:** 16-20px

## Components

### Ghost Pill Button
**Role:** Primary interactive control across the site

Transparent background, 1px Pure White border, 1440px border-radius (full pill), 10px vertical / 18-20px horizontal padding, Pragmatica Cond 14px uppercase Pure White text, letter-spacing -0.02em. Used for 'Start Now', 'Menu', and all primary navigation triggers. The 1440px radius (effectively a stadium shape) is extreme — it pushes these controls into a signature capsule form that appears nowhere else in common UI kits.

### News Bar Solid Button
**Role:** Top-page system announcement trigger

Abyss (#050505) background, 1px Pure White border, 0px border-radius (sharp corners, contrast with pill buttons), 10px vertical / 20px horizontal padding, Pragmatica Cond 14px uppercase text. The sharp-cornered, dark-filled variant is reserved exclusively for the top news strip — the different shape signals a different functional zone (system status, not brand navigation).

### Pill Badge
**Role:** Status markers, numbered tags, micro-labels

Transparent background, 1px Ash (#cecece) border, 1440px border-radius, 5px vertical / 11px horizontal padding, Pragmatica Cond 14px uppercase Pure White text. Used for numbered card markers ('01', '02', etc.) and small inline labels. The lighter Ash border (vs Pure White on buttons) reads as subordinate detail.

### System Card
**Role:** Content panels in the product systems section

Charcoal Surface (#272a2a) background, 10px border-radius, no box-shadow, 32px vertical / 0px horizontal padding (content aligns to card edges). Full-bleed atmospheric photography sits behind or within each card. The 10px radius is the only non-pill radius in the system, creating a deliberate geometric contrast: pill = interactive, rounded rectangle = content container.

### Top News Bar
**Role:** Site-wide announcement strip fixed at the top of every page

Abyss (#050505) background, spans full viewport width, contains centered Roboto Mono 11px uppercase text with bullet separators ('NEWS • JUN 15, 2026 • CRUCIBLE EARLY ACCESS IS NOW OPEN'). The monospace typeface and dotted separators create a terminal/log aesthetic that contrasts with the brand's condensed type.

### Constellation Logo Mark
**Role:** Brand identity anchor in the hero and load contexts

Geometric mark composed of a central diamond with four extending point-shapes arranged in a cross/star pattern, rendered as thin Pure White strokes. Below it, the wordmark 'CIRIDAE' in Pragmatica Cond 32px uppercase Pure White, letter-spacing -0.02em. The mark's four-pointed geometry echoes the system's orthogonal precision.

### Hero Section
**Role:** Full-viewport opening composition

Void Black (#0b0b0b) canvas with full-bleed heavily-blurred atmospheric photography (warm skin tones, bokeh) at 50px backdrop-blur. Centered constellation logo and wordmark. Flanking micro-labels in Pragmatica Cond 14px uppercase Pure White at far left ('AUTOMATE THE MUNDANE') and far right ('ACCELERATE THE REMARKABLE'). The flanking labels span the full width while the logo sits dead center — a triadic composition that fills the viewport without crowding.

### Backers Logo Strip
**Role:** Social proof section with inverted light theme

Bone (#edebe7) background — the only light section, creating a stark visual break. Centered 'OUR WORK IS BACKED BY' label in Pragmatica Cond 14px uppercase, followed by a horizontal row of partner logos (General Catalyst, Accel, Andreessen Horowitz) rendered in Pure White or dark tone. The light-to-dark inversion is the system's most dramatic tonal shift, used once to punctuate the page.

### Section Heading Block
**Role:** Centered typographic header for major dark sections

Eyebrow label in Pragmatica Cond 14px uppercase (e.g. 'AI TRANSFORMATION', 'SYSTEMS, NOT TOOLS'), followed by a large headline in Pragmatica Cond 32px uppercase Pure White, letter-spacing -0.64px, centered on Void Black. Generous vertical breathing room above and below (40-60px). The eyebrow-to-headline pairing is the standard section-opening pattern.

### Footer
**Role:** Site termination with minimal legal/nav content

Void Black (#0b0b0b) background, Pragmatica Cond 14px uppercase Pure White text. Minimal links and legal text arranged in simple rows. No visual embellishment — the footer respects the void.

## Do's and Don'ts

### Do
- Use 1440px border-radius for all buttons, badges, nav items, and pill-shaped interactive elements
- Use 10px border-radius exclusively for card and content containers — pill = interactive, rounded-rect = content
- Set all text in uppercase using Pragmatica Cond at weight 400 — never use bold, never use mixed case
- Apply -0.02em letter-spacing to all type sizes above 14px; -0.01em is acceptable for 15px body passages
- Define surfaces through background tonal shifts (#0b0b0b → #272a2a → #edebe7) and 1px hairline borders, never through box-shadow
- Reserve #cc6437 Ember Rust for hairline accent strokes and small text highlights only — never use it as a fill
- Use Roboto Mono 11px exclusively for system data (news ticker, metadata, technical labels) to create a clear typographic register

### Don't
- Do not introduce bold or semi-bold weights — the entire system operates at weight 400 only
- Do not add drop shadows, glow effects, or any box-shadow values — the system is intentionally flat
- Do not use color fills on buttons — all interactive controls are ghost/outlined with 1px borders
- Do not use mixed-case text or sentence case in any UI label, heading, or body string
- Do not introduce additional accent colors — Ember Rust is the only chromatic note permitted
- Do not use non-pill radii (e.g. 4px, 8px) on buttons, badges, or nav items — the 1440px pill is the system's signature shape
- Do not use gradients — the system is built on flat color fields and blurred photography, not color transitions

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 1 | Void Canvas | `#0b0b0b` | Primary page background for all dark sections including hero, transformation narrative, systems grid, and footer |
| 2 | Abyss Bar | `#050505` | Top news bar — one shade darker than the canvas to push the strip forward without using shadow |
| 3 | Charcoal Card | `#272a2a` | Card and panel surfaces on dark sections — the only elevated surface, defined by tonal shift not shadow |
| 4 | Bone Inversion | `#edebe7` | Light section background for the backers strip — the single dramatic tonal break in the page |

## Elevation

The system deliberately refuses drop shadows. All elevation is communicated through background tonal contrast (#0b0b0b canvas → #272a2a cards → #050505 abyss bar) and 1px hairline borders. The flat treatment is a signature choice: surfaces feel pressed onto the page rather than floating above it, reinforcing the void-chamber aesthetic. Cards in the systems grid deliberately carry box-shadow: none.

## Imagery

Atmospheric, full-bleed photography dominates the hero and card backgrounds. Images are heavily blurred (50px and 40px backdrop-blur values detected) and high-contrast, depicting liquid marble with blue/red swirling patterns, smoke, dark landscape silhouettes, and fire/ember textures. The photography is moody and dark, not high-key — it sits in the same tonal register as the void canvas rather than popping against it. No product photography, no people, no UI screenshots. Imagery is ambient atmosphere, not illustrative content. The card grid pairs each system with a different atmospheric scene, making the photographs function as abstract visual identifiers rather than literal representations of the product.

## Layout

Full-bleed page model with content centered within a ~1400px max width. Hero is a full-viewport dark composition with centered constellation logo, flanked by micro-labels at far left and right. Sections alternate: dark hero → light backers strip (Bone) → dark transformation narrative → dark systems card grid → dark footer. The single light section creates one dramatic tonal break. Card grid uses 4 columns where the first card is approximately 2× wider than the remaining three, creating an asymmetric featured layout. Vertical breathing room between sections is generous (80px+). Navigation is minimal: top news bar + a single left-aligned ghost pill ('Start Now') and right-aligned ghost pill ('Menu') in the header bar. No sidebar, no mega-menu.

## Agent Prompt Guide

**Quick Color Reference**
- text: #ffffff
- background: #0b0b0b
- card surface: #272a2a
- border: #cecece (badges) / #ffffff (buttons)
- accent: #cc6437
- primary action: no distinct CTA color

**Example Component Prompts**

1. Create a ghost pill button: transparent background, 1px #ffffff border, 1440px border-radius, 10px 20px padding, Pragmatica Cond 14px uppercase #ffffff text, letter-spacing -0.02em.

2. Create a system card: #272a2a background, 10px border-radius, no box-shadow, 32px vertical padding, Pragmatica Cond 14px uppercase #ffffff body text, with a full-bleed atmospheric photo behind the content.

3. Create a hero section: #0b0b0b canvas, full-bleed blurred warm-toned photography at 50px backdrop-blur, centered constellation diamond mark (4-point star, thin #ffffff strokes), 'CIRIDAE' wordmark below in Pragmatica Cond 32px uppercase #ffffff, flanking labels in Pragmatica Cond 14px uppercase at far left and far right.

4. Create a top news bar: #050505 background, full-width strip, centered Roboto Mono 11px uppercase #ffffff text with '•' bullet separators, containing a news announcement string.

5. Create a numbered pill badge: transparent background, 1px #cecece border, 1440px border-radius, 5px 11px padding, Pragmatica Cond 14px uppercase #ffffff text (e.g. '01', '02', '03').

## Typographic Register System

Ciridae uses a three-register typographic system to signal information hierarchy without weight variation:

- **Brand voice** — Pragmatica Cond 14-32px, uppercase, 400 weight. All UI labels, headings, navigation, and short brand statements live here. This is what the system sounds like.

- **Body voice** — Pragmatica 15-24px, mixed case allowed but rare, 400 weight. Reserved for longer-form prose passages (card descriptions, explanatory text). The shift to mixed case and a slightly wider letterform signals 'read this as a sentence, not a label.'

- **System voice** — Roboto Mono 11px, uppercase, 400 weight. The news ticker and any technical metadata. Monospace + dot separators create a terminal/log register that says 'this is machine data, not brand communication.'

Never cross registers. A navigation label in Roboto Mono would feel broken. A news announcement in Pragmatica Cond would feel like a headline.

## Similar Brands

- **Nothing (nothing.tech)** — Same near-black canvas with white text, all-caps narrow type, and refusal of color except for a single warm accent — both systems treat the void as the brand
- **Linear** — Dark monochromatic UI with hairline borders, pill-shaped controls, and zero reliance on shadow for elevation — though Linear uses more color in its feature sets
- **Vercel** — Full-bleed dark sections with centered typographic compositions, generous vertical breathing room, and minimal navigation chrome
- **Framework** — Extremely restrained typographic system using condensed uppercase type at small sizes, with color appearing only as a single accent punctuation

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-ember-rust: #cc6437;
  --color-void-black: #0b0b0b;
  --color-charcoal-surface: #272a2a;
  --color-bone: #edebe7;
  --color-bone-darker: #dfddd9;
  --color-pure-white: #ffffff;
  --color-abyss: #050505;
  --color-steel: #484848;
  --color-ash: #cecece;

  /* Typography — Font Families */
  --font-pragmatica-cond: 'Pragmatica Cond', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-pragmatica: 'Pragmatica', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-roboto-mono: 'Roboto Mono', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;

  /* Typography — Scale */
  --text-caption: 11px;
  --leading-caption: 1.1;
  --tracking-caption: -0.22px;
  --text-body-sm: 14px;
  --leading-body-sm: 1.43;
  --tracking-body-sm: -0.28px;
  --text-heading-sm: 20px;
  --leading-heading-sm: 1;
  --tracking-heading-sm: -0.4px;
  --text-heading: 24px;
  --leading-heading: 1.2;
  --tracking-heading: -0.48px;
  --text-heading-lg: 32px;
  --leading-heading-lg: 1.05;
  --tracking-heading-lg: -0.64px;

  /* Typography — Weights */
  --font-weight-regular: 400;

  /* Spacing */
  --spacing-5: 5px;
  --spacing-7: 7px;
  --spacing-8: 8px;
  --spacing-10: 10px;
  --spacing-11: 11px;
  --spacing-16: 16px;
  --spacing-18: 18px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-30: 30px;
  --spacing-32: 32px;
  --spacing-40: 40px;
  --spacing-65: 65px;
  --spacing-80: 80px;
  --spacing-100: 100px;
  --spacing-122: 122px;

  /* Layout */
  --page-max-width: 1400px;
  --section-gap: 80px;
  --card-padding: 32px;
  --element-gap: 16-20px;

  /* Border Radius */
  --radius-sm: 1px;
  --radius-md: 4px;
  --radius-lg: 10px;
  --radius-full: 999px;
  --radius-full-2: 1440px;

  /* Named Radii */
  --radius-nav: 1440px;
  --radius-cards: 10px;
  --radius-badges: 1440px;
  --radius-buttons: 1440px;
  --radius-news-bar-button: 0px;

  /* Surfaces */
  --surface-void-canvas: #0b0b0b;
  --surface-abyss-bar: #050505;
  --surface-charcoal-card: #272a2a;
  --surface-bone-inversion: #edebe7;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-ember-rust: #cc6437;
  --color-void-black: #0b0b0b;
  --color-charcoal-surface: #272a2a;
  --color-bone: #edebe7;
  --color-bone-darker: #dfddd9;
  --color-pure-white: #ffffff;
  --color-abyss: #050505;
  --color-steel: #484848;
  --color-ash: #cecece;

  /* Typography */
  --font-pragmatica-cond: 'Pragmatica Cond', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-pragmatica: 'Pragmatica', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-roboto-mono: 'Roboto Mono', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;

  /* Typography — Scale */
  --text-caption: 11px;
  --leading-caption: 1.1;
  --tracking-caption: -0.22px;
  --text-body-sm: 14px;
  --leading-body-sm: 1.43;
  --tracking-body-sm: -0.28px;
  --text-heading-sm: 20px;
  --leading-heading-sm: 1;
  --tracking-heading-sm: -0.4px;
  --text-heading: 24px;
  --leading-heading: 1.2;
  --tracking-heading: -0.48px;
  --text-heading-lg: 32px;
  --leading-heading-lg: 1.05;
  --tracking-heading-lg: -0.64px;

  /* Spacing */
  --spacing-5: 5px;
  --spacing-7: 7px;
  --spacing-8: 8px;
  --spacing-10: 10px;
  --spacing-11: 11px;
  --spacing-16: 16px;
  --spacing-18: 18px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-30: 30px;
  --spacing-32: 32px;
  --spacing-40: 40px;
  --spacing-65: 65px;
  --spacing-80: 80px;
  --spacing-100: 100px;
  --spacing-122: 122px;

  /* Border Radius */
  --radius-sm: 1px;
  --radius-md: 4px;
  --radius-lg: 10px;
  --radius-full: 999px;
  --radius-full-2: 1440px;
}
```
