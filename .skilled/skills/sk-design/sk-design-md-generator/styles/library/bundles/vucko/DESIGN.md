# Vucko — Style Reference
> oversized type on white gallery floor — a type-specimen book where the wordmark is the room.

**Theme:** light

Vucko operates as a monochrome editorial canvas where the type is the architecture. Pure white surfaces meet pure black ink, with a single faint gray reserved for de-emphasized secondary text and ghost-list items in service lists. The custom Suisse typeface at display sizes — up to 211px — creates a monumental, almost architectural presence where the wordmark alone can fill a viewport. Chromatic color is absent from the system itself, appearing only inside project showcase content (vivid gradients, yellow cards) that punctuates the otherwise austere page. The interface is whisper-thin: hairline 1px borders, zero shadows, generous 58px section gaps, and pill-shaped nav elements. Every screen should read like a page in a high-end art book — restrained, confident, and anti-decoration.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Ink | `#000000` | `--color-ink` | Primary text, all borders, dark surface blocks, and the hero wordmark — the structural backbone of every screen |
| Paper | `#ffffff` | `--color-paper` | Hairline borders, dividers, input outlines, and card edges on light surfaces. Do not promote it to the primary CTA color |
| Faint Ash | `#eeeeee` | `--color-faint-ash` | Subtle surface tint for secondary cards or de-emphasized blocks, barely distinguishable from Paper |
| Steel | `#888a8b` | `--color-steel` | Muted secondary text and ghost-list items in service lists — the only non-black text color, used to create tonal hierarchy without introducing hue |
| Charcoal | `#222222` | `--color-charcoal` | Alternate dark surface for nav or panel backgrounds — a softer dark than Ink when full black is too severe |

## Tokens — Typography

### Suisse Int'l — Sole typeface across the entire system. Weight 700 carries all display and heading roles up to 211px for the hero wordmark; weight 400 handles body and link text. The 211px weight-700 wordmark with -0.057em tracking is the signature — it turns the brand name into a room-scale installation. Weight 500 appears in nav and transitional text. The aggressive negative tracking on display sizes (-0.057em at 211px, -0.020em at 55px) tightens the Swiss grotesque geometry into a denser, more monolithic block — the type is meant to read as architecture, not as text. · `--font-suisse-intl`
- **Substitute:** Inter, Neue Haas Grotesk, or General Sans — any neo-grotesque with similar x-height and geometric terminals
- **Weights:** 400, 500, 700
- **Sizes:** 17, 18, 19, 43, 55, 120, 211
- **Line height:** 0.70, 1.00, 1.05, 1.13, 1.17, 1.21, 1.50
- **Letter spacing:** -0.057em at 211px, -0.020em at 55px, -0.010em at 43px; 0 (normal) at 17-19px body
- **OpenType features:** `"kern" 0`
- **Role:** Sole typeface across the entire system. Weight 700 carries all display and heading roles up to 211px for the hero wordmark; weight 400 handles body and link text. The 211px weight-700 wordmark with -0.057em tracking is the signature — it turns the brand name into a room-scale installation. Weight 500 appears in nav and transitional text. The aggressive negative tracking on display sizes (-0.057em at 211px, -0.020em at 55px) tightens the Swiss grotesque geometry into a denser, more monolithic block — the type is meant to read as architecture, not as text.

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| body-sm | 17px | 1.5 | — | `--text-body-sm` |
| subheading | 19px | 1.5 | — | `--text-subheading` |
| heading | 43px | 1.21 | -0.43px | `--text-heading` |
| heading-lg | 55px | 1.13 | -1.1px | `--text-heading-lg` |
| display | 120px | 1.05 | -6.84px | `--text-display` |
| display-xl | 211px | 1 | -12.03px | `--text-display-xl` |

## Tokens — Spacing & Shapes

**Base unit:** 4px

**Density:** spacious

### Spacing Scale

| Name | Value | Token |
|------|-------|-------|
| 24 | 24px | `--spacing-24` |
| 56 | 56px | `--spacing-56` |
| 96 | 96px | `--spacing-96` |
| 144 | 144px | `--spacing-144` |
| 192 | 192px | `--spacing-192` |

### Border Radius

| Element | Value |
|---------|-------|
| tags | 9999px |
| cards | 9.6px |
| small | 4.8px |
| medium | 7.2px |
| buttons | 9999px |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 58px
- **Card padding:** 24px
- **Element gap:** 23px

## Components

### Top Navigation Bar
**Role:** Minimal site-wide navigation

White (Paper) background, no border, no shadow. Left: 'VUCKO' wordmark at 17px Suisse weight 700 in Ink. Center: location/time text ('Toronto, Canada 20:34 pm') at 17px Suisse weight 400 in Ink. Right: nav links ('Projects, Approach, About, Contact') at 17px Suisse weight 400 in Ink, followed by a small 8px Ink dot indicator with 9999px radius. 56px horizontal padding, approximately 19px vertical padding. The dot serves as an ambient status indicator — it is not interactive.

### Hero Display Wordmark
**Role:** Primary brand statement on landing

The wordmark 'VUCKO™' at 211px Suisse weight 700, color Ink, letter-spacing -12.03px, line-height 1.0. Sits directly on the Paper canvas with 56px left/right padding. The ™ superscript is positioned at the baseline-right of the final O. The wordmark is intended to overflow or fill the viewport width — it is architecture, not text. No background, no border.

### Floating Showcase Card
**Role:** Featured project overlay on hero

A small card positioned absolutely in the upper-right of the hero, ~9.6px border-radius, with a vivid chromatic background (project content — yellow in current instance). Contains a bold black project title ('2023 Wrapped') at ~43px Suisse weight 700 and a small description below at 17px. The card itself is content, not a system component, but the container follows the 9.6px card radius token and 24px internal padding.

### Tagline Section
**Role:** Brand statement below hero

Left-aligned narrow column on Paper canvas. Headline at 19px Suisse weight 400 in Ink, line-height 1.5, max-width ~480px. Below the headline, an underlined text link 'Learn more about our approach' at 17px Suisse weight 400 in Ink with 1px Ink underline. At the far right of the same row, a '(Scroll)' indicator at 17px Suisse weight 400 in Ink. 58px top margin from the hero wordmark.

### Project Showcase Card (Full-bleed)
**Role:** Client work presentation in portfolio

Full-bleed card with 9.6px border-radius, filling the container width minus 56px horizontal padding. Background is a vivid gradient (project content — blue-to-purple in current instance). Centered display text at 55px Suisse weight 700 in Paper (white), letter-spacing -1.1px, with playful decorative elements. A pill button (9999px radius, white fill, black text at 17px) overlaid at the bottom, labeled with a project name. Card internal padding approximately 56px.

### Service Block (Media + Text)
**Role:** Individual service description in services section

Split layout. Left side: a black (Ink) square block, approximately 200px wide, serving as a video/image placeholder. Below the block, body text at 17px Suisse weight 400 in Ink describing the service, max-width ~200px. Right side contains the Service List Display. 23px gap between media and text.

### Service List Display
**Role:** Large-scale service category headings

Three stacked display headings at 55px Suisse weight 700, each on its own line, left-aligned. The first item ('IDENTITIES') in Ink (#000000); subsequent items ('SYSTEMS', 'GUIDELINES') in Steel (#888a8b) to create visual de-emphasis through tonal shift rather than size or weight change. Letter-spacing -1.1px, line-height 1.13. This tonal hierarchy — not size hierarchy — is what makes the list read as a menu rather than a stack of headlines.

### Pill Tag / Button
**Role:** Project labels, nav indicators, and pill-shaped interactive elements

9999px border-radius, white (Paper) background, 1px Ink border optional. Text at 17px Suisse weight 400 in Ink. Padding approximately 10px vertical, 15px horizontal. No shadow, no gradient. Used for project name tags and ambient UI marks. The pill shape is the only non-rectangular element in the system.

### Underline Text Link
**Role:** Primary text-based link style

Text at 17px Suisse weight 400 in Ink with a 1px Ink underline. No background, no border, no padding beyond the text's natural line height. This is the system's link and CTA equivalent — there are no filled buttons in the interface. Hover state may shift underline to a thinner weight or remove it.

### Scroll Indicator
**Role:** Navigation hint at hero boundary

Right-aligned text '(Scroll)' at 17px Suisse weight 400 in Ink. Functions as a passive navigation prompt at the bottom of the hero section. No underline, no decoration. 58px top margin from the tagline section.

## Do's and Don'ts

### Do
- Use #000000 (Ink) for all primary text, borders, and dark surface blocks — it is the only structural color in the system
- Set the hero wordmark at 211px Suisse weight 700 with letter-spacing -12.03px — the type is meant to fill the room
- Apply 56px horizontal padding on the main container and 58px vertical gaps between major sections
- Use 9999px border-radius for all pill-shaped elements: nav dot, tags, and pill buttons
- Use tonal hierarchy (Ink vs Steel at #888a8b) rather than size or weight to create secondary text emphasis
- Use 9.6px border-radius for project cards and content containers
- Apply negative letter-spacing on all display sizes: -12.03px at 211px, -6.84px at 120px, -1.1px at 55px, -0.43px at 43px

### Don't
- Never add colored CTA buttons — this system uses underlined text links and neutral pill elements only
- Never use drop shadows, glow effects, or any form of CSS elevation — depth comes from whitespace and contrast alone
- Never center body text — all running text should be left-aligned
- Never use borders thicker than 1px
- Never introduce chromatic colors into the UI chrome — color belongs exclusively inside project showcase content
- Never use display sizes (55px+) for body copy or secondary content — reserve them for headlines and service titles only
- Never break the whitespace rhythm — maintain 58px minimum between major sections and let the type do the work

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Paper Canvas | `#ffffff` | Base page background — the negative space that defines the entire system |
| 1 | Faint Ash Card | `#eeeeee` | Subtle elevation for secondary cards or de-emphasized content blocks |
| 2 | Charcoal Panel | `#222222` | Alternate dark surface for nav or panel backgrounds when full Ink is too severe |
| 3 | Ink Block | `#000000` | Full-bleed dark sections and media placeholder blocks — the maximum-contrast surface |

## Elevation

The system is entirely flat — no drop shadows, no glow effects, no z-axis elevation of any kind. Depth and hierarchy are achieved exclusively through generous whitespace (58px section gaps, 56px container padding), tonal contrast (Ink vs Paper vs Steel), and the sheer scale of the display type. Cards are distinguished by subtle background tint (#eeeeee) or by being placed on the white canvas with no border at all. This is a deliberate editorial choice: the page should read like a printed art book, not a software interface.

## Imagery

The site itself contains zero photography, illustration, or decorative imagery in the UI chrome. All visual content lives inside project showcase cards, which are client work — vivid gradients (blue-to-purple), bright yellow cards with bold display type, and video blocks. These are portfolio artifacts, not system imagery. The interface is purely typographic: massive Suisse wordmarks, body text, and hairline borders. No icons, no stock photos, no illustrations. The visual richness of the site is entirely generated by the scale and weight of the type itself.

## Layout

The page alternates between full-bleed display moments and narrow centered columns. The hero is a viewport-filling wordmark with no left/right constraint beyond 56px padding. Service sections use a strict split: small media block left (200px), massive display list right. Project showcase cards are full-bleed within the container, filling edge to edge. Body text sections are narrow (max ~480px) and left-aligned. Navigation is a single thin bar with no sticky behavior evident. The vertical rhythm is generous — 58px between major sections creates the feel of turning pages in a large-format book. Content is left-aligned by default; the only centered content is display type inside full-bleed project cards.

## Agent Prompt Guide

**Quick Color Reference**
- text: #000000
- background: #ffffff
- border: #000000
- muted text: #888a8b
- subtle surface: #eeeeee
- primary action: no distinct CTA color

**Example Component Prompts**

1. Create a hero section: white (#ffffff) background, 56px horizontal padding. Display wordmark at 211px Suisse weight 700, color #000000, letter-spacing -12.03px, line-height 1.0. A small yellow card (~9.6px radius, 24px padding) with black bold project title at 43px is positioned absolutely in the upper-right area of the hero.

2. Create a project showcase card: full-bleed within 56px container padding, 9.6px border-radius. Background is a blue-to-purple gradient. Centered white display text at 55px Suisse weight 700 with letter-spacing -1.1px. A white pill button (9999px radius, 10px 15px padding, black text at 17px) overlaid near the bottom.

3. Create a services section: split layout with 23px column gap. Left: a 200px black (#000000) square block with body text below at 17px Suisse weight 400 in #000000. Right: three stacked display headings at 55px Suisse weight 700, the first in #000000, the remaining two in #888a8b, each on its own line with letter-spacing -1.1px and line-height 1.13.

4. Create a top navigation bar: white background, no border, 56px horizontal padding. Left-aligned 'VUCKO' at 17px Suisse weight 700. Centered location/time text at 17px Suisse weight 400. Right-aligned nav links at 17px Suisse weight 400. A small 8px black (#000000) dot with 9999px radius at the far right.

No distinct primary action color was observed; use the extracted neutral button treatments instead of inventing a filled CTA color.

## Similar Brands

- **Manual (manualcreative.com)** — Same monumental-display-type approach with massive neo-grotesque headlines and pure white editorial canvas
- **Locomotive (locomotive.ca)** — Same restraint: monochrome palette, large-scale type, generous whitespace, and zero decorative chrome
- **Resn (resn.co.nz)** — Similar agency-portfolio language with custom type and confident negative space between sections
- **Active Theory (activetheory.net)** — Both position full-bleed project showcases as the visual content while keeping the chrome quiet and typographic
- **Instrument (instrument.com)** — Same editorial-agency sensibility: large custom type, white canvas, and project work as the only color

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-ink: #000000;
  --color-paper: #ffffff;
  --color-faint-ash: #eeeeee;
  --color-steel: #888a8b;
  --color-charcoal: #222222;

  /* Typography — Font Families */
  --font-suisse-intl: 'Suisse Int'l', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-body-sm: 17px;
  --leading-body-sm: 1.5;
  --text-subheading: 19px;
  --leading-subheading: 1.5;
  --text-heading: 43px;
  --leading-heading: 1.21;
  --tracking-heading: -0.43px;
  --text-heading-lg: 55px;
  --leading-heading-lg: 1.13;
  --tracking-heading-lg: -1.1px;
  --text-display: 120px;
  --leading-display: 1.05;
  --tracking-display: -6.84px;
  --text-display-xl: 211px;
  --leading-display-xl: 1;
  --tracking-display-xl: -12.03px;

  /* Typography — Weights */
  --font-weight-regular: 400;
  --font-weight-medium: 500;
  --font-weight-bold: 700;

  /* Spacing */
  --spacing-unit: 4px;
  --spacing-24: 24px;
  --spacing-56: 56px;
  --spacing-96: 96px;
  --spacing-144: 144px;
  --spacing-192: 192px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 58px;
  --card-padding: 24px;
  --element-gap: 23px;

  /* Border Radius */
  --radius-md: 4.8px;
  --radius-lg: 7.2px;
  --radius-lg-2: 9.6px;
  --radius-full: 9999px;

  /* Named Radii */
  --radius-tags: 9999px;
  --radius-cards: 9.6px;
  --radius-small: 4.8px;
  --radius-medium: 7.2px;
  --radius-buttons: 9999px;

  /* Surfaces */
  --surface-paper-canvas: #ffffff;
  --surface-faint-ash-card: #eeeeee;
  --surface-charcoal-panel: #222222;
  --surface-ink-block: #000000;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-ink: #000000;
  --color-paper: #ffffff;
  --color-faint-ash: #eeeeee;
  --color-steel: #888a8b;
  --color-charcoal: #222222;

  /* Typography */
  --font-suisse-intl: 'Suisse Int'l', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-body-sm: 17px;
  --leading-body-sm: 1.5;
  --text-subheading: 19px;
  --leading-subheading: 1.5;
  --text-heading: 43px;
  --leading-heading: 1.21;
  --tracking-heading: -0.43px;
  --text-heading-lg: 55px;
  --leading-heading-lg: 1.13;
  --tracking-heading-lg: -1.1px;
  --text-display: 120px;
  --leading-display: 1.05;
  --tracking-display: -6.84px;
  --text-display-xl: 211px;
  --leading-display-xl: 1;
  --tracking-display-xl: -12.03px;

  /* Spacing */
  --spacing-24: 24px;
  --spacing-56: 56px;
  --spacing-96: 96px;
  --spacing-144: 144px;
  --spacing-192: 192px;

  /* Border Radius */
  --radius-md: 4.8px;
  --radius-lg: 7.2px;
  --radius-lg-2: 9.6px;
  --radius-full: 9999px;
}
```
