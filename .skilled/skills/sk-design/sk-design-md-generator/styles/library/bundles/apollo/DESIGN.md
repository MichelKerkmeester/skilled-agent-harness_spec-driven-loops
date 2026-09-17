# Apollo — Style Reference
> Sun-baked limestone with highlighter-pen accents — editorial warmth over corporate coldness

**Theme:** light

Apollo's visual language is a sun-baked editorial workspace: warm limestone canvas, cream card surfaces, and a single electric yellow-green that functions like a highlighter on paper. The design is deliberately flat — no shadows, no gradients, just clean borders and generous whitespace. Typography does the heavy lifting: a confident medium-weight display serif (Season Mix at 550) commands headlines while a workhorse neo-grotesque (Soehne) handles everything else. Color is rationed aggressively: pages read almost monochrome with the vivid chartreuse appearing only on primary actions and the Apollo star logo, making those moments feel switched on. The overall impression is a premium B2B tool that doesn't try to look like a B2B tool — closer to a design magazine layout than a SaaS dashboard.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Charcoal | `#1a1a1a` | `--color-charcoal` | Primary body text and input values — softer than pure black for extended reading |
| Onyx | `#000000` | `--color-onyx` | Headlines, high-contrast text, icon strokes, and button text on light surfaces |
| Limestone | `#ccc9c6` | `--color-limestone` | Page canvas and footer background — warm gray that prevents the UI from feeling sterile |
| Marble | `#f7f5f2` | `--color-marble` | Card surfaces and button backgrounds — warm cream that lifts cards off the limestone canvas |
| Paper | `#ffffff` | `--color-paper` | Elevated card surfaces and overlay panels — pure white for contrast against the warm canvas |
| Flint | `#e5e7eb` | `--color-flint` | Hairline borders, input outlines, divider lines — the structural grid of the entire interface |
| Graphite | `#47423d` | `--color-graphite` | Decorative SVG fills, secondary icon strokes — warm dark that matches the palette's earthiness |
| Pebble | `#736f6c` | `--color-pebble` | Secondary body text, muted descriptions, and inactive link states |
| Ash | `#94918e` | `--color-ash` | Subtle borders for less prominent structural elements |
| Twilight Indigo | `#3f3653` | `--color-twilight-indigo` | Display heading accent — muted violet that signals editorial personality without breaking the monochromatic discipline |
| Highlighter | `#f8ff2c` | `--color-highlighter` | Green wash for highlight backgrounds, decorative bands, and soft emphasis behind content. Do not promote it to the primary CTA color |
| Volt | `#ebf212` | `--color-volt` | Alternate CTA background variant — slightly warmer yellow-green used on specific button instances |

## Tokens — Typography

### Season Mix — Display headlines at 48–88px. Weight 550 is the signature choice — not bold, not light, a medium that feels confident and editorial. Line-height locked near 1.0 creates dense, magazine-style headline blocks. The slight negative tracking (-0.01em) tightens the display into a cohesive statement. · `--font-season-mix`
- **Substitute:** GT Sectra, Söhne Breit, or Tiempos Headline
- **Weights:** 550
- **Sizes:** 48px, 56px, 64px, 72px, 88px
- **Line height:** 1.00–1.10
- **Letter spacing:** -0.01em
- **Role:** Display headlines at 48–88px. Weight 550 is the signature choice — not bold, not light, a medium that feels confident and editorial. Line-height locked near 1.0 creates dense, magazine-style headline blocks. The slight negative tracking (-0.01em) tightens the display into a cohesive statement.

### Soehne — Body text, hero subcopy, input values, and primary UI text. The workhorse — appears in every context. Slightly positive letter-spacing (0.009em) gives it an open, modern feel despite being a neo-grotesque. · `--font-soehne`
- **Substitute:** Inter, Söhne, or General Sans
- **Weights:** 400
- **Sizes:** 16px, 18px
- **Line height:** 1.00–1.50
- **Letter spacing:** 0.0090em
- **Role:** Body text, hero subcopy, input values, and primary UI text. The workhorse — appears in every context. Slightly positive letter-spacing (0.009em) gives it an open, modern feel despite being a neo-grotesque.

### Abc Diatype — Secondary UI text, nav links, icon labels, and small body copy. Weight 700 for emphasis in compact contexts. Negative tracking (-0.01em) tightens small sizes for legibility. · `--font-abc-diatype`
- **Substitute:** Inter, Söhne, or ABC Diatype (available via Dinamo)
- **Weights:** 400, 700
- **Sizes:** 12px, 14px, 16px, 20px, 24px
- **Line height:** 1.20–1.30
- **Letter spacing:** -0.01em
- **Role:** Secondary UI text, nav links, icon labels, and small body copy. Weight 700 for emphasis in compact contexts. Negative tracking (-0.01em) tightens small sizes for legibility.

### Founders Grotesk Mono — Captions, metadata, eyebrow labels, and data annotations. Slightly positive tracking (0.012–0.014em) keeps monospaced text from feeling cramped at small sizes. · `--font-founders-grotesk-mono`
- **Substitute:** JetBrains Mono, IBM Plex Mono, or Berkeley Mono
- **Weights:** 400
- **Sizes:** 12px, 14px
- **Line height:** 1.20
- **Letter spacing:** 0.0120em, 0.0140em
- **Role:** Captions, metadata, eyebrow labels, and data annotations. Slightly positive tracking (0.012–0.014em) keeps monospaced text from feeling cramped at small sizes.

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 12px | 1.2 | — | `--text-caption` |
| body-sm | 14px | 1.2 | — | `--text-body-sm` |
| body | 16px | 1.5 | — | `--text-body` |
| subheading | 20px | 1.3 | — | `--text-subheading` |
| heading-sm | 24px | 1.3 | — | `--text-heading-sm` |
| heading | 48px | 1.1 | -0.48px | `--text-heading` |
| heading-lg | 56px | 1.05 | -0.56px | `--text-heading-lg` |
| display | 88px | 1 | -0.88px | `--text-display` |

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
| 56 | 56px | `--spacing-56` |
| 80 | 80px | `--spacing-80` |
| 96 | 96px | `--spacing-96` |

### Border Radius

| Element | Value |
|---------|-------|
| cards | 8px |
| images | 12px |
| buttons | 8px |
| small-elements | 4px |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 80px
- **Card padding:** 24px
- **Element gap:** 8px

## Components

### Primary CTA Button
**Role:** Hero and form submission actions

Filled chartreuse background (#f8ff2c or #ebf212), black text, 8px border-radius, 16px vertical / 24px horizontal padding. Soehne 16px weight 400. Sits against any neutral surface — the chartreuse is loud enough to demand attention without needing elevation or borders.

### Ghost Outline Button
**Role:** Secondary actions and SSO login options

Transparent background, 1px Flint (#e5e7eb) border, black text, 8px radius, 16px/24px padding. Used for 'Sign up with Google/Microsoft' and similar secondary paths.

### Nav Text Link
**Role:** Top navigation items

No background, Soehne 16px weight 400, Charcoal (#1a1a1a) text. No underline, no hover background — the simplicity of the nav mirrors the overall editorial restraint.

### Demo Button (Nav)
**Role:** High-intent navigation CTA

Outlined with 1px black border, transparent background, black text, 8px radius. Subtly differentiates from the primary 'Sign up for free' without competing with it.

### Hero Card
**Role:** Product preview container in the hero section

White (#ffffff) surface on the warm Limestone canvas, no shadow, no border, appears to float purely through color contrast. Contains the AI product UI mockup.

### Content Card
**Role:** Feature blocks, FAQ items, and content containers

White or Marble (#f7f5f2) background, 8px radius, 24px internal padding. Separated by whitespace, not borders or shadows.

### FAQ Accordion Row
**Role:** Expandable question/answer items

Transparent background, top/bottom 1px Flint (#e5e7eb) border, no radius. Question text in Soehne 16px, plus icon on the right. Spacious vertical padding (~24px) for touch targets.

### Email Input
**Role:** Email capture in hero form

White background, 1px Flint border, 8px radius, generous padding. Placeholder in Pebble (#736f6c). No focus ring glow — focus state should be a border color shift to black.

### Logo Bar
**Role:** Social proof — company logos

Single horizontal row, logos rendered in Graphite (#47423d) or black, no card containers or dividers. Clean, typeset, editorial.

### Testimonial Block
**Role:** Large pull-quote with attribution

Season Mix display weight at heading-lg/display size for the quote, Soehne 14–16px for attribution below. No quotation marks — the typography IS the emphasis.

### Cookie Consent Banner
**Role:** GDPR/privacy notice overlay

White surface with subtle border, rounded corners, positioned bottom-center. Contains text, privacy link, and three text buttons (More choices, Reject all, Accept all) in Soehne.

## Do's and Don'ts

### Do
- Use Season Mix weight 550 for all display headlines at 48px+ — never bold, never light
- Set primary CTA background to Highlighter (#f8ff2c) with black text — no border, no shadow needed
- Default card radius to 8px across all components — consistency is the design
- Use Flint (#e5e7eb) for all hairline borders at 1px — structural grid, not decoration
- Set page canvas to Limestone (#ccc9c6) and cards to Paper (#f7f5f2) for the warm-on-warm layering effect
- Use negative letter-spacing (-0.01em) on all Season Mix and Abc Diatype sizes; positive tracking (0.009–0.014em) on Soehne and Founders Grotesk Mono
- Maintain 80px minimum between major sections — the whitespace is the luxury

### Don't
- Never add box-shadows — the design system is intentionally flat, borders and color contrast do all the work
- Never use the chartreuse accent on anything other than primary CTAs and the Apollo star logo — it loses impact if diluted
- Never use cool grays (blue-tinted) — the palette is warm: Limestone, Marble, Pebble, Graphite
- Never bold display headlines — Season Mix weight 550 is the maximum, the restraint is the signature
- Never use #3f3653 violet for body text or UI — it's reserved for display heading accents only
- Never add gradients — the system is deliberately flat and editorial
- Never use border-radius larger than 12px — the design is precise, not soft and bubbly

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Limestone Canvas | `#ccc9c6` | Page background and footer — warm gray that prevents sterile white-page feel |
| 1 | Marble Card | `#f7f5f2` | Card surfaces and secondary buttons — warm cream that lifts content off the canvas |
| 2 | Paper Surface | `#ffffff` | Elevated cards, input fields, and overlay panels — maximum contrast for interactive elements |
| 3 | Highlighter Accent | `#f8ff2c` | Primary action surfaces — the only chromatic layer in the stack |

## Elevation

Apollo's design system intentionally avoids box-shadows entirely. Depth and hierarchy are achieved through a warm-on-warm color stacking system (Limestone → Marble → Paper) and consistent 1px hairline borders in Flint. This creates an editorial, print-inspired feel where components sit flat against the page like elements on a magazine layout, rather than floating as material-design cards. The flatness is deliberate — it signals confidence and premium restraint.

## Imagery

Product UI screenshots are the primary visual content — shown in the hero card and feature sections as actual product mockups (AI prompt interface, contact lists, sequence builders). Company logos in the social proof bar are rendered flat in dark gray or black with no styling treatment. The overall visual language is text-dominant with product screenshots as supporting evidence, not lifestyle photography or abstract graphics. Iconography is minimal and line-based, rendered in black or Graphite.

## Agent Prompt Guide

Quick Color Reference:
- background: #ccc9c6 (Limestone canvas)
- card surface: #f7f5f2 (Marble)
- text: #1a1a1a (Charcoal body) / #000000 (Onyx headlines)
- border: #e5e7eb (Flint hairline)
- accent: #3f3653 (Twilight Indigo, display only)
- primary action: #ebf212 (filled action)

Example Component Prompts:

1. Create a Primary Action Button: #ebf212 background, #000000 text, 9999px radius, compact pill padding. Use this filled treatment for the main CTA.

2. Create a FAQ accordion: White background, each row separated by 1px #e5e7eb top/bottom borders, no radius. Question text in Soehne 16px #1a1a1a, plus icon right-aligned in #000000. 24px vertical padding per row.

3. Create a content card: #f7f5f2 background, 8px radius, 24px padding. Heading in Season Mix 48px weight 550, #1a1a1a. Body in Soehne 16px, #47423d. No shadow, no border.

4. Create a logo bar: Single horizontal row, logos in #47423d, no card containers, no dividers, 40px gap between logos. Eyebrow label above in Founders Grotesk Mono 12px, uppercase, #736f6c.

5. Create a testimonial block: Season Mix 64px weight 550 for the quote, #1a1a1a. Attribution below in Soehne 14px, #736f6c. No quotation marks, no decorative elements — let the type do the work.

## Similar Brands

- **Clay** — Same warm neutral canvas with a single vivid accent color (Clay uses orange) and editorial display typography for headlines
- **Attio** — Similar light-mode B2B tool with warm grays, flat surfaces, and restrained color usage that lets one accent do the work
- **Lemlist** — Sales tool with bright accent buttons on neutral backgrounds and clean borderless card layouts
- **Notion** — Same flat design philosophy with no shadows, hairline borders, and monochrome-first palette where color is rationed to actions

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-charcoal: #1a1a1a;
  --color-onyx: #000000;
  --color-limestone: #ccc9c6;
  --color-marble: #f7f5f2;
  --color-paper: #ffffff;
  --color-flint: #e5e7eb;
  --color-graphite: #47423d;
  --color-pebble: #736f6c;
  --color-ash: #94918e;
  --color-twilight-indigo: #3f3653;
  --color-highlighter: #f8ff2c;
  --color-volt: #ebf212;

  /* Typography — Font Families */
  --font-season-mix: 'Season Mix', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-soehne: 'Soehne', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-abc-diatype: 'Abc Diatype', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-founders-grotesk-mono: 'Founders Grotesk Mono', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.2;
  --text-body-sm: 14px;
  --leading-body-sm: 1.2;
  --text-body: 16px;
  --leading-body: 1.5;
  --text-subheading: 20px;
  --leading-subheading: 1.3;
  --text-heading-sm: 24px;
  --leading-heading-sm: 1.3;
  --text-heading: 48px;
  --leading-heading: 1.1;
  --tracking-heading: -0.48px;
  --text-heading-lg: 56px;
  --leading-heading-lg: 1.05;
  --tracking-heading-lg: -0.56px;
  --text-display: 88px;
  --leading-display: 1;
  --tracking-display: -0.88px;

  /* Typography — Weights */
  --font-weight-regular: 400;
  --font-weight-w550: 550;
  --font-weight-bold: 700;

  /* Spacing */
  --spacing-unit: 8px;
  --spacing-8: 8px;
  --spacing-16: 16px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-40: 40px;
  --spacing-48: 48px;
  --spacing-56: 56px;
  --spacing-80: 80px;
  --spacing-96: 96px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 80px;
  --card-padding: 24px;
  --element-gap: 8px;

  /* Border Radius */
  --radius-md: 4px;
  --radius-lg: 8px;
  --radius-xl: 12px;

  /* Named Radii */
  --radius-cards: 8px;
  --radius-images: 12px;
  --radius-buttons: 8px;
  --radius-small-elements: 4px;

  /* Surfaces */
  --surface-limestone-canvas: #ccc9c6;
  --surface-marble-card: #f7f5f2;
  --surface-paper-surface: #ffffff;
  --surface-highlighter-accent: #f8ff2c;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-charcoal: #1a1a1a;
  --color-onyx: #000000;
  --color-limestone: #ccc9c6;
  --color-marble: #f7f5f2;
  --color-paper: #ffffff;
  --color-flint: #e5e7eb;
  --color-graphite: #47423d;
  --color-pebble: #736f6c;
  --color-ash: #94918e;
  --color-twilight-indigo: #3f3653;
  --color-highlighter: #f8ff2c;
  --color-volt: #ebf212;

  /* Typography */
  --font-season-mix: 'Season Mix', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-soehne: 'Soehne', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-abc-diatype: 'Abc Diatype', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-founders-grotesk-mono: 'Founders Grotesk Mono', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.2;
  --text-body-sm: 14px;
  --leading-body-sm: 1.2;
  --text-body: 16px;
  --leading-body: 1.5;
  --text-subheading: 20px;
  --leading-subheading: 1.3;
  --text-heading-sm: 24px;
  --leading-heading-sm: 1.3;
  --text-heading: 48px;
  --leading-heading: 1.1;
  --tracking-heading: -0.48px;
  --text-heading-lg: 56px;
  --leading-heading-lg: 1.05;
  --tracking-heading-lg: -0.56px;
  --text-display: 88px;
  --leading-display: 1;
  --tracking-display: -0.88px;

  /* Spacing */
  --spacing-8: 8px;
  --spacing-16: 16px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-40: 40px;
  --spacing-48: 48px;
  --spacing-56: 56px;
  --spacing-80: 80px;
  --spacing-96: 96px;

  /* Border Radius */
  --radius-md: 4px;
  --radius-lg: 8px;
  --radius-xl: 12px;
}
```
