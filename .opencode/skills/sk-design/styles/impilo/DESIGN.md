# Impilo — Style Reference
> Midnight clinical observatory — a violet command console where health data glows in cyan.

**Theme:** dark

Impilo operates in a deep midnight-violet universe where the canvas itself (#16165c) carries the brand — there is no white default, only progressively lighter violet surfaces stacking toward #f4f4f6 for inverted sections. A single typeface (Gilroy) speaks in two voices: weight 500 for running text and weight 600 for display, with aggressive negative tracking at large sizes that makes headlines feel engineered rather than written. The accent system is a clinical triad — cyan #00b1ff for data and links, mint #00ffaa for positive states, and a lighter violet #b1a6f6 for line-art illustration — so color never decorates, it always means something. Surfaces are pill-soft (1425px buttons, 24-32px cards) and float on ambient violet shadows rather than neutral grays, keeping every elevation on-brand.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Deep Iris | `#16165c` | `--color-deep-iris` | Page canvas, hero background, primary surface — the brand-defining midnight violet that sets the entire dark mode identity |
| Iris Shadow | `#232269` | `--color-iris-shadow` | Elevated card surfaces on dark canvas, secondary card backgrounds — one step lighter than canvas for depth without breaking the violet atmosphere |
| Iris Glow | `#403cd5` | `--color-iris-glow` | Mid-tone accent surface, footer background, highlighted metric blocks — mid-violet for tertiary elevation and accent fills |
| Iris Pulse | `#5350cc` | `--color-iris-pulse` | Violet action color for filled buttons, selected navigation states, and focused conversion moments. |
| Iris Border | `#4846c6` | `--color-iris-border` | Card border outlines, subtle surface edges on dark mode — keeps card perimeters defined without breaking the violet mood |
| Iris Veil | `#524fe1` | `--color-iris-veil` | Body and card border accent, secondary surface outline — lighter violet for hairline separators on dark surfaces |
| Lilac Mist | `#b1a6f6` | `--color-lilac-mist` | Line-art illustration stroke, decorative SVG fills, wireframe graphics — soft violet for technical/medical illustration overlay |
| Clinical Cyan | `#00b1ff` | `--color-clinical-cyan` | Data highlights, chart strokes, icon accents, inline links, interactive borders — the primary data-viz and link color across the UI |
| Cyan Soft | `#59b4ff` | `--color-cyan-soft` | Secondary cyan accent, softer data labels, gradient endpoints paired with Clinical Cyan |
| Mint Vital | `#00ffaa` | `--color-mint-vital` | Green outline accent for tags, dividers, and focused UI edges. Use as a supporting accent, not as a status color |
| Teal Signal | `#2ee9ff` | `--color-teal-signal` | Highlight accent for key data callouts and chart emphasis — brighter teal-cyan for moments that need to pop |
| Cloud White | `#ffffff` | `--color-cloud-white` | Primary text, button text on dark, button backgrounds in light section, high-contrast headings |
| Pearl | `#f4f4f6` | `--color-pearl` | Soft icon strokes, subtle dividers, and low-emphasis decorative details. Do not promote it to the primary CTA color |
| Ash | `#d8d8e3` | `--color-ash` | Muted text on light sections, secondary borders, low-emphasis labels |
| Fog | `#9494a9` | `--color-fog` | Hairline dividers, disabled borders, low-contrast separators |

## Tokens — Typography

### Gilroy — Sole typeface across the entire system — weight 500 for body, links, buttons, cards; weight 600 for all headings and display. Gilroy's geometric humanism gives medical data a friendly, non-clinical warmth · `--font-gilroy`
- **Substitute:** Manrope (closest free alternative with similar geometric humanist proportions) or Plus Jakarta Sans
- **Weights:** 500, 600
- **Sizes:** 12px, 13px, 14px, 17px, 18px, 24px, 46px, 54px, 66px, 92px, 124px
- **Line height:** 0.92 (display) / 1.00 (headlines) / 1.44 (body)
- **Letter spacing:** -0.0750em at 92px+ (display) / -0.0400em at 46-66px (headings) / -0.0300em at 17-24px (body) / 0.0200em at 12-14px (captions)
- **Role:** Sole typeface across the entire system — weight 500 for body, links, buttons, cards; weight 600 for all headings and display. Gilroy's geometric humanism gives medical data a friendly, non-clinical warmth

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 12px | 1.44 | 0.24px | `--text-caption` |
| body-sm | 14px | 1.44 | 0.28px | `--text-body-sm` |
| subheading | 18px | 1.44 | -0.54px | `--text-subheading` |
| heading-sm | 24px | 1.44 | -0.72px | `--text-heading-sm` |
| heading | 46px | 1 | -1.84px | `--text-heading` |
| heading-lg | 54px | 1 | -2.16px | `--text-heading-lg` |
| heading-xl | 66px | 1 | -2.64px | `--text-heading-xl` |
| display | 92px | 0.92 | -6.9px | `--text-display` |
| display-xl | 124px | 0.92 | -9.3px | `--text-display-xl` |

## Tokens — Spacing & Shapes

**Base unit:** 4px

**Density:** comfortable

### Spacing Scale

| Name | Value | Token |
|------|-------|-------|
| 8 | 8px | `--spacing-8` |
| 12 | 12px | `--spacing-12` |
| 16 | 16px | `--spacing-16` |
| 20 | 20px | `--spacing-20` |
| 24 | 24px | `--spacing-24` |
| 32 | 32px | `--spacing-32` |
| 36 | 36px | `--spacing-36` |
| 40 | 40px | `--spacing-40` |
| 48 | 48px | `--spacing-48` |
| 116 | 116px | `--spacing-116` |
| 220 | 220px | `--spacing-220` |

### Border Radius

| Element | Value |
|---------|-------|
| tags | 9999px |
| cards | 24px |
| icons | 7px |
| inputs | 16px |
| buttons | 9999px |
| cards-elevated | 32px |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 80px
- **Card padding:** 24px
- **Element gap:** 8px

## Components

### Pill CTA Button (Primary)
**Role:** Primary action trigger in hero and navigation

Filled pill button, 9999px border-radius, Iris Pulse (#5350cc) background, Cloud White (#ffffff) text at 17px Gilroy weight 500, 16px 24px padding. Includes ambient violet box-shadow (#3c39b9 at low opacity) to lift it off the dark canvas. Used for 'Request Demo' in nav and main CTAs.

### Pill Button (Ghost)
**Role:** Secondary or outline action on dark canvas

Transparent or Pearl (#f4f4f6) fill with 9999px radius, Cloud White text/border, 17px Gilroy weight 500, used for secondary nav actions like arrow-prefixed links ('→ About Us').

### Pill Button (Light Section)
**Role:** Primary action in inverted Pearl sections

Pearl (#f4f4f6) or Cloud White fill, dark text, 9999px radius, 17px Gilroy weight 500, 16px 24px padding. Appears in the white 'End-to-end white glove service' section.

### Dark Canvas Card
**Role:** Data dashboard panel, elevated content block

Iris Shadow (#232269) background, 24px border-radius, 1px Iris Border (#4846c6) hairline, 24px internal padding. Contains metric headers, chart areas, and tab strips. No drop shadow — depth comes from the lighter violet fill against the deeper canvas.

### Highlighted Metric Card
**Role:** Hero metric display (e.g., 'Blood Pressure Average 127/73')

Semi-transparent Iris Glow (#403cd5) or Iris Shadow (#232269) background, 24px radius, large numeric value in Clinical Cyan (#00b1ff) at 66-92px Gilroy weight 600, with a small label in Cloud White at 12-14px.

### Tab Strip (Dashboard)
**Role:** Metric category selector within dashboard

Horizontal row of pill-shaped tabs (9999px radius) on a dark card. Active tab: Iris Pulse (#5350cc) background with white text. Inactive: transparent with Lilac Mist (#b1a6f6) text. Each tab pairs a small icon with a label at 14px Gilroy weight 500.

### Patient Profile Card
**Role:** Sidebar patient identity block

Left-aligned card on Iris Shadow (#232269) background, 24px radius, contains a branded logo mark, patient name in Cloud White weight 600, DOB metadata in Pearl at 13px, and contact/address lines with icon prefixes. No border — relies on tonal contrast.

### Billing Summary List
**Role:** Categorized list with icon-prefixed rows

Stacked list items within a card, each row: small icon (7px radius container) in Lilac Mist, label text in Pearl, value text in Cloud White at 17px Gilroy weight 500. 8-12px vertical gap between rows.

### Chart Container
**Role:** Data visualization wrapper

Full-width container within a dark card, transparent background, chart strokes in Clinical Cyan (#00b1ff) and Mint Vital (#00ffaa) for data series, Iris Border (#4846c6) for gridlines, Cloud White for axis labels at 12px. Charts float on the card's Iris Shadow fill.

### Word Highlight Box
**Role:** Dotted-outline emphasis treatment for key headline words

Transparent background with a 1px dashed border in Clinical Cyan or Lilac Mist at 7px radius, wrapping a single emphasized word in the headline. Used on 'personalized.' in the hero — a signature callout device.

### Navigation Bar (Dark)
**Role:** Top-level site navigation

Transparent or Deep Iris background, 80px height. Logo (Impilo wordmark with heart/pulse icon) left, nav links center in Cloud White at 17px Gilroy weight 500 with dropdown arrows, pill Request Demo button right.

### Section Divider (Light Inversion)
**Role:** Break between dark and light page sections

Hard color break from Deep Iris (#16165c) canvas to Pearl (#f4f4f6) section. Light section uses Deep Iris text on Pearl background. No gradient transition — the cut is intentional and stark.

### Compliance Badge Pair
**Role:** Dual certification display in light sections

Two hexagonal/shield-shaped badge containers side by side, 7px radius, with dark line-art icons and text labels in Deep Iris. Sits within a rounded rectangle frame with 1px Ash border.

### Line-Art Illustration
**Role:** Decorative wireframe graphics on dark hero

Monochromatic line drawings in Lilac Mist (#b1a6f6) at 1-2px stroke weight, depicting medical devices (stethoscope, monitor) and laptops. Full-height on the left side of the hero, no fills — pure outline aesthetic that signals 'connected health' without literalism.

## Do's and Don'ts

### Do
- Use Deep Iris (#16165c) as the page canvas for all dark sections — never introduce a neutral gray or pure black background
- Set all buttons and tags to 9999px border-radius — pill geometry is non-negotiable and defines the brand silhouette
- Apply -0.075em letter-spacing at 92px+ display sizes to make headlines feel compressed and engineered rather than airy
- Reserve Clinical Cyan (#00b1ff) for data, links, and chart strokes — never as a decorative fill
- Pair Mint Vital (#00ffaa) with health-positive data (vitals in range, active status) to give green semantic meaning beyond decoration
- Use the dotted-outline Word Highlight Box for the single most important word in any headline — one per page maximum
- Break between dark and light sections with a hard color cut at Pearl (#f4f4f6) — no gradient transitions between themes

### Don't
- Never use a neutral gray (e.g., #1a1a1a, #2a2a2a) as a background — all dark surfaces must stay in the violet family
- Do not mix weight 400 or 700 into the type system — Gilroy speaks only in 500 and 600
- Never apply Clinical Cyan (#00b1ff) as a large solid fill on buttons or hero blocks — it is a data/link color, not a surface color
- Do not use Mint Vital (#00ffaa) for error states or warnings — its meaning is locked to positive health signals
- Avoid sharp corners (0-4px radius) on any container — minimum 7px for icons, 16px for inputs, 24px for cards
- Do not introduce a second typeface — Gilroy at weights 500/600 covers every typographic need
- Never use white (#ffffff) as a card background on the dark canvas — the light inversion section is the only place Cloud White surfaces belong
- Do not use gradient transitions between dark and light sections — the hard cut is a signature choice

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 1 | Deep Iris Canvas | `#16165c` | Page and hero background — the foundational dark surface |
| 2 | Iris Shadow | `#232269` | Elevated cards and panels on dark canvas |
| 3 | Iris Glow | `#403cd5` | Highlighted metric blocks, footer, mid-elevation panels |
| 4 | Pearl Inversion | `#f4f4f6` | Light-section backgrounds, inverted content blocks |
| 5 | Cloud White | `#ffffff` | Top-elevation card surfaces in light sections, button fills |

## Elevation

- **Primary CTA Button:** `0 0 20px rgba(60, 57, 185, 0.4) — ambient violet glow, not a neutral drop shadow`
- **Dashboard Card:** `no box-shadow`
- **Highlighted Metric Block:** `1px Iris Border (#4846c6) hairline, no shadow`
- **Navigation Pill Button:** `no shadow on dark canvas`

## Imagery

Line-art wireframe illustrations in Lilac Mist (#b1a6f6) at 1-2px stroke weight depict medical devices (stethoscope, heart-rate monitor, laptop) as decorative atmosphere on the left side of the hero. No photography or full-color illustration — the visual language is monochromatic, technical, and schematic, reinforcing a 'connected health infrastructure' metaphor. Icons are thin-stroke, single-color, at 7px container radius, used as functional markers (phone, location, mail, chart-type) rather than decorative elements. The dashboard screenshots show product UI embedded as hero evidence rather than marketing imagery.

## Layout

Full-bleed dark canvas with no max-width constraint on the violet sections — the Deep Iris fills edge to edge. Hero is split: left third holds the line-art illustration, right two-thirds carry the headline and CTA stack with the dashboard card overlapping the section bottom. Navigation is a transparent top bar with a pill CTA right-aligned. The page alternates between full-width dark bands and a centered max-width 1200px light section. Content in dark sections is right-aligned to the text column; the light section is centered with single-column text and a centered compliance badge pair.

## Agent Prompt Guide

**Quick Color Reference**
- text: #ffffff (on dark) / #16165c (on light)
- background: #16165c (dark canvas) / #f4f4f6 (light section)
- border: #4846c6 (dark cards) / #d8d8e3 (light cards)
- accent: #00b1ff (data, links, chart strokes)
- positive state: #00ffaa (healthy vitals, active status)
- primary action: #5350cc (filled action)

**3 Example Component Prompts**

1. **Hero Section**: Deep Iris (#16165c) full-bleed background. Headline at 92px Gilroy weight 600, #ffffff, letter-spacing -6.9px, line-height 0.92. Emphasized word wrapped in a dotted-outline box with 1px dashed #00b1ff border at 7px radius. Body subtext at 17px Gilroy weight 500, #f4f4f6. Ghost pill button with #f4f4f6 text and #f4f4f6 border, 9999px radius, 16px 24px padding. Lilac Mist (#b1a6f6) line-art illustration (medical devices) on the left third, no fills, 1-2px stroke.

2. **Dark Dashboard Card**: Iris Shadow (#232269) background, 24px border-radius, 1px Iris Border (#4846c6) hairline, 24px padding. Tab strip at top: 9999px pill tabs, active tab Iris Pulse (#5350cc) with #ffffff text at 14px Gilroy weight 500, inactive tabs transparent with #b1a6f6 text. Large metric value at 66px Gilroy weight 600 in #00b1ff. Chart area below with strokes in #00b1ff and #00ffaa, gridlines in #4846c6, axis labels in #ffffff at 12px.

3. **Light Section (Inverted)**: Pearl (#f4f4f6) background, full-width. Centered headline at 66px Gilroy weight 600, #16165c, letter-spacing -2.64px. Body text at 17px Gilroy weight 500, #16165c. Compliance badge pair: two hexagonal containers side by side, 7px radius, with #16165c line-art icons and #16165c text labels, framed in a rounded rectangle with 1px #d8d8e3 border.

## Color Hierarchy Rules

The violet family has a strict tonal hierarchy: Deep Iris (#16165c) is ALWAYS the canvas, never an accent. Iris Shadow (#232269) is ALWAYS one level up. Iris Glow (#403cd5) is for highlighted metric blocks. Iris Pulse (#5350cc) is ONLY for pressed/active states and filled primary buttons. Lilac Mist (#b1a6f6) is ONLY for line-art illustration and decorative SVG — never for text or fills. Clinical Cyan (#00b1ff) and Mint Vital (#00ffaa) are the only two colors allowed to break the violet monochrome — they carry data meaning and must not be used as decorative backgrounds.

## Typography Rhythm

Gilroy weight 600 handles all display and heading work, with aggressive negative tracking scaling with size: -0.030em at body, -0.040em at heading, -0.075em at 92px+. This tracking compression is a signature — headlines feel like they are pulled tight rather than set loose. Weight 500 handles all running text at 17px body with 1.44 line-height. The smallest sizes (12-14px) use positive tracking (+0.020em) to improve legibility at caption scale. The 124px display size with 0.92 line-height and -9.3px tracking is the hero maximum — anything larger would break the system.

## Similar Brands

- **Ro (direct-to-patient healthcare)** — Dark-violet canvas with clinical cyan data accents, pill-shaped CTAs, and a single-geometric-typeface system that makes health data feel approachable
- **Hims & Hers** — Deep saturated brand-color backgrounds used as the primary canvas rather than neutral surfaces, with rounded cards and pill navigation
- **Tempus AI** — Dark-mode health-tech dashboard aesthetic with violet/indigo canvas, cyan data accents, and oversized display headlines with aggressive negative tracking
- **Forward Health** — Midnight-violet dark theme with single bright accent color for data, rounded soft cards, and large compressed-tracking display type

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-deep-iris: #16165c;
  --color-iris-shadow: #232269;
  --color-iris-glow: #403cd5;
  --color-iris-pulse: #5350cc;
  --color-iris-border: #4846c6;
  --color-iris-veil: #524fe1;
  --color-lilac-mist: #b1a6f6;
  --color-clinical-cyan: #00b1ff;
  --color-cyan-soft: #59b4ff;
  --color-mint-vital: #00ffaa;
  --color-teal-signal: #2ee9ff;
  --color-cloud-white: #ffffff;
  --color-pearl: #f4f4f6;
  --color-ash: #d8d8e3;
  --color-fog: #9494a9;

  /* Typography — Font Families */
  --font-gilroy: 'Gilroy', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.44;
  --tracking-caption: 0.24px;
  --text-body-sm: 14px;
  --leading-body-sm: 1.44;
  --tracking-body-sm: 0.28px;
  --text-subheading: 18px;
  --leading-subheading: 1.44;
  --tracking-subheading: -0.54px;
  --text-heading-sm: 24px;
  --leading-heading-sm: 1.44;
  --tracking-heading-sm: -0.72px;
  --text-heading: 46px;
  --leading-heading: 1;
  --tracking-heading: -1.84px;
  --text-heading-lg: 54px;
  --leading-heading-lg: 1;
  --tracking-heading-lg: -2.16px;
  --text-heading-xl: 66px;
  --leading-heading-xl: 1;
  --tracking-heading-xl: -2.64px;
  --text-display: 92px;
  --leading-display: 0.92;
  --tracking-display: -6.9px;
  --text-display-xl: 124px;
  --leading-display-xl: 0.92;
  --tracking-display-xl: -9.3px;

  /* Typography — Weights */
  --font-weight-medium: 500;
  --font-weight-semibold: 600;

  /* Spacing */
  --spacing-unit: 4px;
  --spacing-8: 8px;
  --spacing-12: 12px;
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-36: 36px;
  --spacing-40: 40px;
  --spacing-48: 48px;
  --spacing-116: 116px;
  --spacing-220: 220px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 80px;
  --card-padding: 24px;
  --element-gap: 8px;

  /* Border Radius */
  --radius-md: 6.9984px;
  --radius-2xl: 15.9984px;
  --radius-3xl: 24.0048px;
  --radius-3xl-2: 31.9968px;
  --radius-full: 1425.6px;

  /* Named Radii */
  --radius-tags: 9999px;
  --radius-cards: 24px;
  --radius-icons: 7px;
  --radius-inputs: 16px;
  --radius-buttons: 9999px;
  --radius-cards-elevated: 32px;

  /* Surfaces */
  --surface-deep-iris-canvas: #16165c;
  --surface-iris-shadow: #232269;
  --surface-iris-glow: #403cd5;
  --surface-pearl-inversion: #f4f4f6;
  --surface-cloud-white: #ffffff;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-deep-iris: #16165c;
  --color-iris-shadow: #232269;
  --color-iris-glow: #403cd5;
  --color-iris-pulse: #5350cc;
  --color-iris-border: #4846c6;
  --color-iris-veil: #524fe1;
  --color-lilac-mist: #b1a6f6;
  --color-clinical-cyan: #00b1ff;
  --color-cyan-soft: #59b4ff;
  --color-mint-vital: #00ffaa;
  --color-teal-signal: #2ee9ff;
  --color-cloud-white: #ffffff;
  --color-pearl: #f4f4f6;
  --color-ash: #d8d8e3;
  --color-fog: #9494a9;

  /* Typography */
  --font-gilroy: 'Gilroy', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.44;
  --tracking-caption: 0.24px;
  --text-body-sm: 14px;
  --leading-body-sm: 1.44;
  --tracking-body-sm: 0.28px;
  --text-subheading: 18px;
  --leading-subheading: 1.44;
  --tracking-subheading: -0.54px;
  --text-heading-sm: 24px;
  --leading-heading-sm: 1.44;
  --tracking-heading-sm: -0.72px;
  --text-heading: 46px;
  --leading-heading: 1;
  --tracking-heading: -1.84px;
  --text-heading-lg: 54px;
  --leading-heading-lg: 1;
  --tracking-heading-lg: -2.16px;
  --text-heading-xl: 66px;
  --leading-heading-xl: 1;
  --tracking-heading-xl: -2.64px;
  --text-display: 92px;
  --leading-display: 0.92;
  --tracking-display: -6.9px;
  --text-display-xl: 124px;
  --leading-display-xl: 0.92;
  --tracking-display-xl: -9.3px;

  /* Spacing */
  --spacing-8: 8px;
  --spacing-12: 12px;
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-36: 36px;
  --spacing-40: 40px;
  --spacing-48: 48px;
  --spacing-116: 116px;
  --spacing-220: 220px;

  /* Border Radius */
  --radius-md: 6.9984px;
  --radius-2xl: 15.9984px;
  --radius-3xl: 24.0048px;
  --radius-3xl-2: 31.9968px;
  --radius-full: 1425.6px;
}
```
