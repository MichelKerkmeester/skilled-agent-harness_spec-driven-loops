# cord.com — Style Reference
> deep ocean signal station — a deep-navy command deck set against white sea-fog, punctuated by one bright blue flare

**Theme:** light

Cord uses a maritime-monochrome language: an almost white canvas flooded with generous air, a near-black midnight navy (#0b3658) carrying every word of weight, and a single bright harbor-blue accent (#4e9ad9) reserved for the logo, the primary button, and active states. The type system rides one family (Figtree) from weight 400 body up to weight 800 display, producing headlines that feel stamped rather than set. Surfaces are soft and rounded — cards float on tinted-blue shadows rather than hard borders, with corner radii between 20px and 32px that make the product feel approachable despite the serious navy palette. Rhythm is calm and centered: one dominant headline, one subtitle, one search field, no chrome — the UI reads like a job board stripped to its essentials and then lightly polished. The only chromatic deviation outside the navy/blue axis is a green presence indicator (#42b3b1) and a single dark CTA banner that flips to the navy ground color, creating the page's one moment of contrast.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Midnight Harbor | `#0b3658` | `--color-midnight-harbor` | Primary text, headings, logo, dark CTA banner — the near-black navy that carries the entire voice of the interface |
| Signal Blue | `#4e9ad9` | `--color-signal-blue` | Primary action background, logo wordmark, active nav and toggle states — the single bright chromatic accent against the navy/white axis |
| Slate Channel | `#486984` | `--color-slate-channel` | Secondary text, outlined link borders, muted icon strokes — mid-tone companion to Midnight Harbor for de-emphasized copy |
| Pale Steel | `#688dac` | `--color-pale-steel` | Tertiary text and meta labels, light borders on headings — the lightest blue-gray still reading as chromatic |
| Sea Fog | `#dde7ee` | `--color-sea-fog` | Card borders, image borders, link underlines, hairline dividers — the dominant neutral stroke color |
| Ice Tint | `#e6f1fa` | `--color-ice-tint` | Subtle background washes, hover surfaces, tinted input backgrounds — barely-there blue for grouping without weight |
| Light Mist | `#c8d8e4` | `--color-light-mist` | Disabled or secondary button fill, neutral surface accent — the warm-cool border between Ice Tint and Sea Fog |
| Canvas White | `#ffffff` | `--color-canvas-white` | Page background, card surface, button text — the dominant canvas that every other color sits on |
| Active Teal | `#42b3b1` | `--color-active-teal` | Teal outline accent for tags, dividers, and focused UI edges |

## Tokens — Typography

### Figtree — Single-family system: weight 400 for body, 600 for emphasis, 700 for subheadings, 800 for display headlines. The heavy display weight is the signature — headlines feel stamped rather than set, a deliberate contrast to the quiet 400 body. Negative letter-spacing tightens proportionals as size grows. · `--font-figtree`
- **Substitute:** Inter, DM Sans, or Plus Jakarta Sans
- **Weights:** 400, 600, 700, 800
- **Sizes:** 10px, 14px, 16px, 18px, 20px, 22px, 24px, 32px, 48px, 100px
- **Line height:** 1.20, 1.30, 1.40, 1.50, 2.81
- **Letter spacing:** -0.005em to -0.005em (negative tracking throughout, tightens at display sizes)
- **Role:** Single-family system: weight 400 for body, 600 for emphasis, 700 for subheadings, 800 for display headlines. The heavy display weight is the signature — headlines feel stamped rather than set, a deliberate contrast to the quiet 400 body. Negative letter-spacing tightens proportionals as size grows.

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 10px | 1.5 | 0.1px | `--text-caption` |
| body-sm | 14px | 1.4 | -0.07px | `--text-body-sm` |
| body | 16px | 1.5 | -0.08px | `--text-body` |
| subheading | 18px | 1.4 | -0.09px | `--text-subheading` |
| heading-sm | 20px | 1.3 | -0.1px | `--text-heading-sm` |
| heading | 24px | 1.3 | -0.12px | `--text-heading` |
| heading-lg | 32px | 1.25 | -0.16px | `--text-heading-lg` |
| display | 48px | 1.2 | -0.24px | `--text-display` |
| hero | 100px | 1 | -0.5px | `--text-hero` |

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
| 80 | 80px | `--spacing-80` |
| 180 | 180px | `--spacing-180` |

### Border Radius

| Element | Value |
|---------|-------|
| cards | 20px |
| pills | 35px |
| badges | 5px |
| images | 20px |
| inputs | 24px |
| buttons | 24px |

### Shadows

| Name | Value | Token |
|------|-------|-------|
| xl | `rgba(11, 54, 88, 0.08) 0px 12px 48px 0px` | `--shadow-xl` |
| xl-2 | `rgba(11, 54, 88, 0.08) 0px 4px 32px 0px` | `--shadow-xl-2` |
| md | `rgba(11, 54, 88, 0.04) 0px 4px 12px 0px` | `--shadow-md` |
| xl-3 | `rgba(11, 54, 88, 0.08) 0px -20px 80px 0px` | `--shadow-xl-3` |
| sm | `rgb(255, 255, 255) 0px 0px 8px 16px` | `--shadow-sm` |
| xl-4 | `rgba(11, 54, 88, 0.04) 0px 4px 32px 0px` | `--shadow-xl-4` |
| xl-5 | `rgba(11, 54, 88, 0.08) 0px -4px 32px 0px` | `--shadow-xl-5` |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 64px
- **Card padding:** 20px
- **Element gap:** 12px

## Components

### Primary CTA Button (filled)
**Role:** The single most important interactive — used for 'Get started', hero search submit, and dark banner CTA

Background #4e9ad9, text #ffffff, Figtree weight 600, 16px, padding 12px 20px, border-radius 24px (pill). No border. Optional subtle shadow rgba(11,54,88,0.04) on hover.

### Ghost / Outlined Button
**Role:** Secondary actions, nav links that look interactive but de-emphasized

Transparent background, text #0b3658, border-radius 24px, padding 8px 16px, weight 600, no fill. Hovers to #e6f1fa background wash.

### Text Link
**Role:** In-flow links, footer links, inline references

Color #4e9ad9 or #0b3658 depending on context, weight 400-600, underline 1px in #dde7ee or transparent. No background, no border-radius.

### Search Input (hero)
**Role:** The hero's single primary input — a wide pill with placeholder and keyboard hint

Background #ffffff, border 1px solid #dde7ee, border-radius 24px, padding 16px 20px, Figtree 16px weight 400. Icon left in #486984, keyboard shortcut chip (⌘K) right in #e6f1fa with 5px radius. Shadow rgba(11,54,88,0.08) at 4px/32px on focus.

### Toggle Switch (segmented)
**Role:** The 'For finding work / For hiring' selector at the top of the hero

Pill container with two text labels. Active side: text #0b3658, weight 700. Inactive side: text #486984, weight 400. Background of active segment #e6f1fa. Pill radius 20px, container radius 24px.

### Company Card
**Role:** Core content unit — the 3-column grid of companies hiring

White background, border-radius 20px, shadow 0 12px 48px rgba(11,54,88,0.08). Padding 20px. Top: full-width company image (border-radius 20px, no gap). Below: company logo (40px square) + name (Figtree 16px weight 700 #0b3658). Meta row: location · sector · funding, Figtree 14px weight 400 #486984. Bottom: Active badge (#e6f1fa background, #4e9ad9 text, 5px radius) + '100% responsive' text in #42b3b1 weight 600.

### Navigation Header
**Role:** Top bar with logo, nav links, auth, and primary CTA

Transparent or #ffffff background, sticky. Logo left ('cord' wordmark in #4e9ad9, Figtree 24px weight 800). Center/right: text links ('For finding work', 'For hiring', 'Sign in') in #486984 weight 600 14px. Far right: filled CTA button (#4e9ad9) + dark/light mode toggle (moon icon).

### Logo Wordmark
**Role:** Brand identity across the site

Lowercase 'cord' in Figtree 24-32px weight 800, color #4e9ad9. No icon mark — text only.

### Dark CTA Banner
**Role:** Full-bleed section near page bottom — 'Talk directly to the people that matter'

Background #0b3658 (Midnight Harbor), full-bleed. Headline white, Figtree weight 800, 48-56px. Subtext #dde7ee weight 400 18px. CTA button: filled #4e9ad9, white text, 24px radius. Below CTA: avatar stack (overlapping circular 24px) + '+463 joined last week' in #dde7ee weight 400.

### Status Badge (Active / Live)
**Role:** Indicates when a company was last active

Pill shape, 5px radius, padding 3px 8px. Background #e6f1fa, text #4e9ad9, Figtree 12px weight 600. Dot prefix optional.

### Filter Chip
**Role:** Category filters below hero — Start ups, Scale ups, Enterprise, etc.

White background, border 1px #dde7ee, border-radius 8px, padding 8px 16px, Figtree 14px weight 600 #0b3658. Icon prefix in #486984.

### Footer Link Column
**Role:** Four-column footer with categorized links

Column heading: Figtree 16px weight 700 #0b3658. Links: 14px weight 400 #486984, line-height 1.8, 8px vertical gap. No bullets, no underlines. Left column includes a logo mark + ~3-line description in #486984 14px.

### Avatar Stack
**Role:** Social proof element — overlapping user avatars showing recent joiners

Circular avatars 24-32px, border 2px #0b3658 (to separate from dark banner background) or 2px #ffffff (on light bg). 3-5 visible with -8px overlap. Followed by count text in matching weight 400.

## Do's and Don'ts

### Do
- Use #0b3658 for all primary text and headings — never reach for pure black, the navy tint is the voice
- Reserve #4e9ad9 for exactly three things: the logo, the primary filled button, and active/selected states
- Set display headlines at weight 800 — the heavy weight is the signature, lighter weights read as body
- Use border-radius 20-24px on cards, buttons, and inputs — the generous rounding is what makes the navy palette feel approachable
- Tint all shadows with rgba(11,54,88, ...) at 4-8% opacity — gray shadows fight the brand
- Apply negative letter-spacing on all sizes above 24px, increasing in tightness as size grows
- Use #dde7ee for all hairlines and borders — it's the dominant neutral stroke and unifies the system

### Don't
- Don't introduce a second accent color — #42b3b1 (teal) is a status indicator, not a brand color to echo elsewhere
- Don't use solid black #000000 for text — always #0b3658, the navy is the voice not pure black
- Don't use sharp corners (< 8px) on cards or buttons — the rounding is a brand pillar
- Don't add drop shadows that aren't blue-tinted — generic gray shadows break the system
- Don't use weight 400 or 500 for display headlines — 700-800 is the stamped-headline signature
- Don't use #4e9ad9 for body text or large headings — it's a signal color, reserved for small interactive moments
- Don't place the dark CTA banner anywhere except as a full-bleed section near page end — it's a contrast moment, not a repeated pattern

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Canvas | `#ffffff` | Page background — the open white sea everything floats on |
| 1 | Ice Tint | `#e6f1fa` | Tinted section backgrounds, subtle grouping washes |
| 2 | Card | `#ffffff` | Elevated content surfaces — company cards, search field, filter chips |
| 3 | Dark Banner | `#0b3658` | Full-bleed CTA section, flips the palette to the navy ground |

## Elevation

- **Card (company tile, feature card):** `0px 12px 48px 0px rgba(11, 54, 88, 0.08)`
- **Card (subtle variant):** `0px 4px 32px 0px rgba(11, 54, 88, 0.08)`
- **Button (hover lift):** `0px 4px 12px 0px rgba(11, 54, 88, 0.04)`

## Imagery

Photography-heavy with real company culture shots: group team photos, office environments, outdoor gatherings. Images are always full-bleed within their card with 20px border-radius matching the card's corners — no padding gap. Treatment is natural color, not desaturated or duotone — each company's image carries its own palette. The visual hierarchy places the human/team photo as the dominant element, with logo and metadata subordinate. No illustration, no abstract graphics, no 3D renders — authenticity is the visual language. Avatars in the social proof stack are circular crops of real profile photos.

## Layout

Centered, max-width ~1200px container with generous horizontal padding. Hero is vertically stacked and centered: nav bar → toggle → 100px display headline (two lines) → subtitle → search input → filter chip row. Sections below flow as a 3-column responsive grid of company cards, equal-width with consistent 20-24px gaps. The dark CTA banner is a full-bleed break — it extends edge-to-edge ignoring the container constraint, creating the page's one moment of tonal contrast. Footer is a 4-column link grid. Navigation is a minimal sticky top bar with logo left, three text links center, and a filled CTA + mode toggle right. The overall rhythm alternates between airy white sections and one concentrated dark moment.

## Agent Prompt Guide

## Quick Color Reference
- text (primary): #0b3658
- text (secondary/meta): #486984
- text (tertiary/labels): #688dac
- background (canvas): #ffffff
- background (tinted wash): #e6f1fa
- border/hairline: #dde7ee
- accent/logo/active: #4e9ad9
- primary action: #4e9ad9 (filled action)
- presence/status: #42b3b1
- dark surface (CTA banner): #0b3658

## Example Component Prompts
1. **Hero search block**: White canvas. Toggle pill (rounded 24px container, active segment #e6f1fa fill, inactive text #486984, active text #0b3658 weight 700). Headline 'Match with people hiring' at 100px Figtree weight 800, color #0b3658, letter-spacing -0.5px, line-height 1.0. Subtitle at 18px weight 400 #486984. Search input: 24px radius, 1px border #dde7ee, white fill, 16px 20px padding, placeholder text in #486984, ⌘K chip at right with #e6f1fa fill and 5px radius.
2. **Company card**: White card, 20px radius, shadow 0 12px 48px rgba(11,54,88,0.08), padding 20px. Top: full-width company photo, 20px radius. Below: 40px square logo + 'Vega' at 16px weight 700 #0b3658. Meta line at 14px weight 400 #486984: 'London, UK · Finance, FinTech · Series A'. Bottom row: status pill (#e6f1fa fill, #4e9ad9 text, 5px radius, 12px weight 600) + '100% responsive' in #42b3b1 weight 600.
3. **Dark CTA banner**: Full-bleed #0b3658 background. Headline at 48px Figtree weight 800 #ffffff, letter-spacing -0.24px. Subtext at 18px weight 400 #dde7ee. Filled CTA button: #4e9ad9 background, white text, 24px radius, 12px 20px padding. Avatar stack: 3 circular 32px avatars with 2px #0b3658 border, -8px overlap, followed by '+463 joined last week' in 14px weight 400 #dde7ee.
4. **Primary CTA button (light context)**: Background #4e9ad9, text #ffffff, Figtree 16px weight 600, padding 12px 20px, border-radius 24px, no border. Optional hover: shadow rgba(11,54,88,0.04) 0px 4px 12px.
5. **Filter chip row**: Horizontal flex of chips, 8px gap. Each chip: white fill, 1px #dde7ee border, 8px radius, 8px 16px padding, Figtree 14px weight 600 #0b3658, optional 16px icon prefix in #486984.

## Similar Brands

- **Linear** — Same single-accent strategy — deep monochrome palette with one reserved chromatic action color, generous border-radii, and stacked centered hero patterns
- **Vercel** — Identical tight display tracking on geometric sans, pill-shaped buttons, and the contrast of one dark full-bleed CTA section against a white canvas
- **Wellfound (AngelList Talent)** — Direct category peer — same job-board card grid layout with company photos, location/sector meta, and 'active X ago' status language in matching typographic register
- **Notion** — Same generous 20-24px border-radius treatment, blue-tinted shadows, and the single-family sans-serif type system with heavy display weights

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-midnight-harbor: #0b3658;
  --color-signal-blue: #4e9ad9;
  --color-slate-channel: #486984;
  --color-pale-steel: #688dac;
  --color-sea-fog: #dde7ee;
  --color-ice-tint: #e6f1fa;
  --color-light-mist: #c8d8e4;
  --color-canvas-white: #ffffff;
  --color-active-teal: #42b3b1;

  /* Typography — Font Families */
  --font-figtree: 'Figtree', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 10px;
  --leading-caption: 1.5;
  --tracking-caption: 0.1px;
  --text-body-sm: 14px;
  --leading-body-sm: 1.4;
  --tracking-body-sm: -0.07px;
  --text-body: 16px;
  --leading-body: 1.5;
  --tracking-body: -0.08px;
  --text-subheading: 18px;
  --leading-subheading: 1.4;
  --tracking-subheading: -0.09px;
  --text-heading-sm: 20px;
  --leading-heading-sm: 1.3;
  --tracking-heading-sm: -0.1px;
  --text-heading: 24px;
  --leading-heading: 1.3;
  --tracking-heading: -0.12px;
  --text-heading-lg: 32px;
  --leading-heading-lg: 1.25;
  --tracking-heading-lg: -0.16px;
  --text-display: 48px;
  --leading-display: 1.2;
  --tracking-display: -0.24px;
  --text-hero: 100px;
  --leading-hero: 1;
  --tracking-hero: -0.5px;

  /* Typography — Weights */
  --font-weight-regular: 400;
  --font-weight-semibold: 600;
  --font-weight-bold: 700;
  --font-weight-extrabold: 800;

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
  --spacing-80: 80px;
  --spacing-180: 180px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 64px;
  --card-padding: 20px;
  --element-gap: 12px;

  /* Border Radius */
  --radius-md: 5px;
  --radius-lg: 8px;
  --radius-2xl: 16px;
  --radius-2xl-2: 20px;
  --radius-3xl: 24px;
  --radius-3xl-2: 32px;
  --radius-3xl-3: 35px;
  --radius-3xl-4: 40px;
  --radius-full: 48px;
  --radius-full-2: 80px;
  --radius-full-3: 120px;

  /* Named Radii */
  --radius-cards: 20px;
  --radius-pills: 35px;
  --radius-badges: 5px;
  --radius-images: 20px;
  --radius-inputs: 24px;
  --radius-buttons: 24px;

  /* Shadows */
  --shadow-xl: rgba(11, 54, 88, 0.08) 0px 12px 48px 0px;
  --shadow-xl-2: rgba(11, 54, 88, 0.08) 0px 4px 32px 0px;
  --shadow-md: rgba(11, 54, 88, 0.04) 0px 4px 12px 0px;
  --shadow-xl-3: rgba(11, 54, 88, 0.08) 0px -20px 80px 0px;
  --shadow-sm: rgb(255, 255, 255) 0px 0px 8px 16px;
  --shadow-xl-4: rgba(11, 54, 88, 0.04) 0px 4px 32px 0px;
  --shadow-xl-5: rgba(11, 54, 88, 0.08) 0px -4px 32px 0px;

  /* Surfaces */
  --surface-canvas: #ffffff;
  --surface-ice-tint: #e6f1fa;
  --surface-card: #ffffff;
  --surface-dark-banner: #0b3658;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-midnight-harbor: #0b3658;
  --color-signal-blue: #4e9ad9;
  --color-slate-channel: #486984;
  --color-pale-steel: #688dac;
  --color-sea-fog: #dde7ee;
  --color-ice-tint: #e6f1fa;
  --color-light-mist: #c8d8e4;
  --color-canvas-white: #ffffff;
  --color-active-teal: #42b3b1;

  /* Typography */
  --font-figtree: 'Figtree', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 10px;
  --leading-caption: 1.5;
  --tracking-caption: 0.1px;
  --text-body-sm: 14px;
  --leading-body-sm: 1.4;
  --tracking-body-sm: -0.07px;
  --text-body: 16px;
  --leading-body: 1.5;
  --tracking-body: -0.08px;
  --text-subheading: 18px;
  --leading-subheading: 1.4;
  --tracking-subheading: -0.09px;
  --text-heading-sm: 20px;
  --leading-heading-sm: 1.3;
  --tracking-heading-sm: -0.1px;
  --text-heading: 24px;
  --leading-heading: 1.3;
  --tracking-heading: -0.12px;
  --text-heading-lg: 32px;
  --leading-heading-lg: 1.25;
  --tracking-heading-lg: -0.16px;
  --text-display: 48px;
  --leading-display: 1.2;
  --tracking-display: -0.24px;
  --text-hero: 100px;
  --leading-hero: 1;
  --tracking-hero: -0.5px;

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
  --spacing-80: 80px;
  --spacing-180: 180px;

  /* Border Radius */
  --radius-md: 5px;
  --radius-lg: 8px;
  --radius-2xl: 16px;
  --radius-2xl-2: 20px;
  --radius-3xl: 24px;
  --radius-3xl-2: 32px;
  --radius-3xl-3: 35px;
  --radius-3xl-4: 40px;
  --radius-full: 48px;
  --radius-full-2: 80px;
  --radius-full-3: 120px;

  /* Shadows */
  --shadow-xl: rgba(11, 54, 88, 0.08) 0px 12px 48px 0px;
  --shadow-xl-2: rgba(11, 54, 88, 0.08) 0px 4px 32px 0px;
  --shadow-md: rgba(11, 54, 88, 0.04) 0px 4px 12px 0px;
  --shadow-xl-3: rgba(11, 54, 88, 0.08) 0px -20px 80px 0px;
  --shadow-sm: rgb(255, 255, 255) 0px 0px 8px 16px;
  --shadow-xl-4: rgba(11, 54, 88, 0.04) 0px 4px 32px 0px;
  --shadow-xl-5: rgba(11, 54, 88, 0.08) 0px -4px 32px 0px;
}
```
