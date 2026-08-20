# Origin Financial — Style Reference
> midnight gallery of quiet wealth. A hushed, near-black room where oversized serif whispers and a few luminous color panels make finance feel like curated art.

**Theme:** dark

Origin presents personal finance as a nocturnal gallery: near-black canvases, whisper-weight serif display headlines at 80-96px (Lyon Display at weight 300), and chromatic feature cards that hover like illuminated color panels. Most surfaces stay quiet and monochromatic, with saturated color appearing only as full-bleed category tiles for spending, investing, and forecasting modules, and as data signals (chart lines, sparklines). Typography splits into three distinct voices: a high-contrast serif for emotive statements, a neo-grotesque sans for UI, and a monospace for uppercase technical labels and data, producing an editorial-meets-precision feel. White-on-black is the only primary action; the rest of the interface recedes into the dark.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Iris Gleam | `#847dff` | `--color-iris-gleam` | Primary chromatic accent for feature category cards — the signature violet that appears most often across module tiles |
| Cyan Signal | `#00b3dd` | `--color-cyan-signal` | Data accent — chart lines, sparkline strokes, and forecasting indicators on dark surfaces |
| Pale Iris | `#d1c9ff` | `--color-pale-iris` | Light variant of the brand violet for softer category panels and background washes |
| Deep Iris | `#4b49aa` | `--color-deep-iris` | Dark variant of the brand violet for shaded category panels and hover states |
| Orchid Bloom | `#dd90d8` | `--color-orchid-bloom` | Pink category card for lifestyle/spending modules — warm contrast against the cool palette |
| Periwinkle | `#90b8f0` | `--color-periwinkle` | Soft blue category card for advisory or couples modules |
| Obsidian | `#0f1011` | `--color-obsidian` | Page canvas — the dominant dark surface that everything floats on |
| Abyss | `#090a0b` | `--color-abyss` | Slightly deeper than Obsidian for subtle stacked sections and shadow tone |
| Graphite | `#2e2e2e` | `--color-graphite` | Mid-dark card surface for elevated modules and data panels |
| Steel | `#3f4041` | `--color-steel` | Hover/pressed surface for interactive elements and secondary raised panels |
| Silver | `#cacaca` | `--color-silver` | Light card surface for inverted panels, stat blocks, and testimonial cards |
| Fog | `#6a6b6b` | `--color-fog` | Muted text and disabled-link color |
| Ash | `#9f9fa0` | `--color-ash` | Body text, descriptions, and secondary links — never full white |
| Cloud | `#f5f5f7` | `--color-cloud` | Heading text variant for softer white display where #ffffff feels too sterile |
| Pure | `#ffffff` | `--color-pure` | Primary text, primary action fill, and nav icon strokes — the brightest element in the system |
| Void | `#000000` | `--color-void` | Icon fills, button text on white fills, and input backgrounds |

## Tokens — Typography

### Suisseintltrial — Suisseintltrial — detected in extracted data but not described by AI · `--font-suisseintltrial`
- **Weights:** 400
- **Sizes:** 11px, 14px, 16px
- **Line height:** 1, 1.5, 1.67, 2.18
- **Letter spacing:** 0.182
- **Role:** Suisseintltrial — detected in extracted data but not described by AI

### Lyon Display — Display headlines and section titles — the signature voice. Used only at weight 300 (light) to create whisper-soft authority; the extreme size range (38-96px) with tight 0.9 line-height is a defining tension · `--font-lyon-display`
- **Substitute:** DM Serif Display or Playfair Display (Google Fonts) at weight 400 with manual letter-spacing tightening
- **Weights:** 300
- **Sizes:** 38px, 80px, 96px
- **Line height:** 0.9-1.0
- **Letter spacing:** normal (0)
- **Role:** Display headlines and section titles — the signature voice. Used only at weight 300 (light) to create whisper-soft authority; the extreme size range (38-96px) with tight 0.9 line-height is a defining tension

### Suisse Int'l — Body copy, card descriptions, link text, and input fields. Weight 300 appears in 18px card subheads for a subtle echo of the display voice; weight 400 is the workhorse UI text · `--font-suisse-intl`
- **Substitute:** Inter or Geist Sans at matching weights
- **Weights:** 300, 400
- **Sizes:** 
- **Line height:** 1.41-2.0
- **Letter spacing:** normal (0)
- **Role:** Body copy, card descriptions, link text, and input fields. Weight 300 appears in 18px card subheads for a subtle echo of the display voice; weight 400 is the workhorse UI text

### Suisse Int'l Trial — Extended UI text at 16px (buttons, nav, links) and uppercase tracked labels at 11px. Shares lineage with Suisse Int'l · `--font-suisse-intl-trial`
- **Substitute:** Inter or Geist Sans
- **Weights:** 400
- **Sizes:** 
- **Line height:** 1.0-2.18
- **Letter spacing:** 0.1820em on 11px uppercase (≈2px tracking) — the widest tracking in the system
- **Role:** Extended UI text at 16px (buttons, nav, links) and uppercase tracked labels at 11px. Shares lineage with Suisse Int'l

### Roboto Mono — Monospaced labels, data readouts, badge text, and uppercase micro-copy (≤12px). Always set in uppercase. Weight 500 for 12px button labels; weight 400 for 10-11px annotations · `--font-roboto-mono`
- **Substitute:** Roboto Mono (Google Fonts) — already free
- **Weights:** 400, 500
- **Sizes:** 10px, 11px, 12px, 16px
- **Line height:** 1.35-2.0
- **Letter spacing:** 0.0160em to 0.0210em for small uppercase (≈0.16-0.25px at 12px), normal for 16px
- **Role:** Monospaced labels, data readouts, badge text, and uppercase micro-copy (≤12px). Always set in uppercase. Weight 500 for 12px button labels; weight 400 for 10-11px annotations

### Suisseintl — Suisseintl — detected in extracted data but not described by AI · `--font-suisseintl`
- **Weights:** 300, 400
- **Sizes:** 12px, 14px, 16px, 18px
- **Line height:** 1, 1.41, 1.43, 1.5, 2
- **Role:** Suisseintl — detected in extracted data but not described by AI

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| mono-label | 12px | 2 | — | `--text-mono-label` |
| body-sm | 14px | 1.67 | — | `--text-body-sm` |
| body | 16px | 1.5 | — | `--text-body` |
| subheading | 18px | 1.5 | — | `--text-subheading` |
| heading-lg | 38px | 0.9 | — | `--text-heading-lg` |
| display-sm | 80px | 1 | — | `--text-display-sm` |
| display | 96px | 0.9 | — | `--text-display` |

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
| 60 | 60px | `--spacing-60` |
| 68 | 68px | `--spacing-68` |
| 100 | 100px | `--spacing-100` |
| 120 | 120px | `--spacing-120` |
| 140 | 140px | `--spacing-140` |

### Border Radius

| Element | Value |
|---------|-------|
| cards | 16px |
| inputs | 8px |
| buttons | 8px |
| navItems | 8px |
| statBlocks | 16px |
| pillButtons | 9999px |
| featureCards | 30px |
| categoryTiles | 30px |

### Shadows

| Name | Value | Token |
|------|-------|-------|
| lg | `rgba(0, 0, 0, 0.2) 0px 18px 20px 0px` | `--shadow-lg` |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 80px
- **Card padding:** 32px
- **Element gap:** 12px

## Components

### Primary CTA Button
**Role:** High-contrast action trigger on dark backgrounds

White fill (#ffffff), black text (#000000), 8px border-radius, 12px vertical / 18px horizontal padding, Suisse Int'l 16px weight 400. Always paired with a right-arrow icon (→). The brightest element on screen — uses the highest contrast pair in the system (21:1 AAA).

### Ghost Outline Button
**Role:** Secondary navigation and tertiary actions

Transparent background with 1px white border (rgb(255,255,255)), white text, 8px radius, 12px/18px padding, Suisse Int'l 16px. Used in nav bar for 'PRODUCTS', 'FOR EMPLOYERS', 'RESOURCES'.

### Nav Glass Button
**Role:** Sticky navigation items with glassmorphic treatment

Background rgba(255,255,255,0.1), 1px white border, 8px radius, 9px/12px padding. Sits inside a nav bar with backdrop-filter blur(24px) over the Obsidian canvas — frosted glass over dark.

### Pill Badge Button
**Role:** Compact tag-style trigger for chat or messaging entry

White 20% fill (rgba(255,255,255,0.2)), 1px white border, 100% radius (pill shape), 1px/6px padding. Icon-only or short text. Used for floating action affordances.

### Pill Chip Label
**Role:** Uppercase category or section eyebrow labels

Background rgba(255,255,255,0.12), 1px border at rgba(255,255,255,0.15), 1440px border-radius (full pill), 10px/32px padding, white text #fafafa at 10-11px. Promotional messaging like the $1 promo.

### Feature Category Card
**Role:** Full-bleed colored tile for spending/investing/forecasting modules

One of six chromatic backgrounds (Iris Gleam, Cyan Signal, Pale Iris, Deep Iris, Orchid Bloom, or Periwinkle), 30px border-radius, 32px padding on all sides, white or near-white text. Holds an icon, title (Lyon Display 38px/300), and short Suisse Int'l description. Color is the only differentiator between categories — no icons or labels needed for grouping.

### Stat / Inverted Card
**Role:** Light surface card for testimonials, stats, or feature callouts

Background #cacaca (Silver), 30px border-radius, 32px padding. Dark text #000000 inside. Breaks the dark-only rhythm — used sparingly to spotlight a single piece of content.

### Phone Mockup Module
**Role:** Product showcase for app features

Graphite background #2e2e2, 16px border-radius, 90px padding on all sides (dramatic breathing room). Contains a tilted iPhone render of the Origin app on Obsidian canvas. The largest padding value in the system — signals premium product framing.

### AI Prompt Input
**Role:** Natural-language query field for the AI financial advisor

Black background (#000000), near-white text #fafafa, 8px border-radius, 8px vertical / 22px left padding (asymmetric: generous left padding for the cursor). Suisse Int'l 14-16px. Paired with a circular submit button (100% radius, white 20% fill, arrow icon). Placeholder: 'Where am I overspending this month?'

### Promo Eyebrow Badge
**Role:** Pill-shaped promotional or pricing label above headlines

White 12% background, 1px white 15% border, 1440px radius, 10px/32px padding. Roboto Mono 12px weight 500, uppercase, white. Text examples follow the pattern: '$1 FOR 1 YEAR — LIMITED TIME'.

### Award Laurel Badge
**Role:** Third-party press or industry recognition marker

Transparent background, white SVG laurel-wreath icon flanking publication name (Forbes, Fast Company) in Lyon Display 18px weight 300, with Roboto Mono 10-12px uppercase sub-text. Sits centered as social proof.

### Display Headline
**Role:** Hero and section-opening statements

Lyon Display at weight 300, sizes 80-96px, line-height 0.9, color #ffffff or #f5f5f7. Italic word ('Own', 'Simplify') is mixed with roman to create editorial tension within a single headline. The whisper-weight at 96px is anti-convention — most fintech sites use 600-700, this achieves authority through restraint.

### Section Subhead
**Role:** Supporting text under headlines and card titles

Suisse Int'l 18px weight 300 (echoing the display voice), line-height 1.5, color #ffffff for card titles or #9f9fa0 for body descriptions. The 300 weight on body is deliberate — creates vertical harmony with the 300 display.

## Do's and Don'ts

### Do
- Set all display headlines in Lyon Display (or DM Serif Display substitute) at weight 300 — never bold the display
- Use 8px radius for all buttons, inputs, and nav items; 16-30px for cards; 9999px only for true pill chips
- Reserve chromatic colors (Iris Gleam, Cyan Signal, Orchid Bloom, etc.) exclusively for full-bleed feature category tiles — never as inline accents or borders
- Use white-on-black (#ffffff fill, #000000 text) as the only primary action; contrast ratio is 21:1
- Apply Roboto Mono uppercase at 10-12px with tracking 0.016-0.182em for all labels, badges, and data annotations
- Maintain line-height 0.9 on Lyon Display 96px headlines — tight leading is a signature
- Differentiate surfaces by color step (#0f1011 → #2e2e2 → #cacaca), not by shadow

### Don't
- Do not bold Lyon Display — weight 300 is the system's defining tension
- Do not apply drop shadows to cards; the system is intentionally flat
- Do not use chromatic accent colors on text smaller than 18px — they vibrate against dark backgrounds
- Do not set body text at full #ffffff white — use #9f9fa0 (Ash) for descriptions and #f5f5f7 (Cloud) for headings instead
- Do not break the three-voice typography system: serif display for emotion, sans for UI, mono for data
- Do not add decorative gradients to UI surfaces — the only legitimate gradient is the dark chrome one (rgb(43,43,44) → rgb(19,19,19))
- Do not use #00b3dd (Cyan Signal) for body color or large fills — it is reserved for data signals and chart lines

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Obsidian Canvas | `#0f1011` | Page background — the base everything sits on |
| 1 | Abyss | `#090a0b` | Full-bleed dark sections alternating with canvas for subtle banding |
| 2 | Graphite Card | `#2e2e2` | Elevated product cards and data modules |
| 3 | Steel Hover | `#3f4041` | Interactive hover/pressed states on dark surfaces |
| 4 | Silver Inverted | `#cacaca` | Light inverted cards for stat blocks and testimonials |

## Elevation

Elevation is expressed through surface color shifts, not drop shadows. Only one shadow token exists in the system (rgba(0,0,0,0.2) 0px 18px 20px — used on a single button), meaning the design deliberately trades shadow depth for a flat, gallery-wall aesthetic. Cards differentiate through #0f1011 → #2e2e2 → #cacaca stepping, and glassmorphism (backdrop-filter blur(24px)) on the nav bar provides the only true depth cue.

## Imagery

Atmospheric photography anchors the hero (a full-bleed cloud-and-sky photograph with a desaturated cool treatment that reads as aspirational open sky rather than literal weather). Product visualization is delivered through tilted iPhone renders of the Origin app on near-black backgrounds — the device is the hero, with a subtle volumetric glow rather than screen-glare effects. There are no illustrations, no abstract graphics, and no lifestyle photography. Icons are minimal, line-weight monoline SVGs rendered in white or as silhouette marks. The overall ratio is heavily text-dominant: typography carries ~80% of the visual weight, imagery is reserved for hero atmosphere and product proof.

## Layout

Full-bleed dark canvas (max-width 1200px content container, but sections break to edge). The page rhythm alternates: (1) atmospheric photo hero with centered headline and inline AI prompt, (2) full-bleed #0f1011 module sections, (3) light #cacaca inverted stat blocks for contrast, (4) product mockup bands with 90px internal padding. Headlines are always center-aligned; feature category cards are arranged in a 3-column grid with 12-15px gaps. Vertical section spacing ranges 24-80px, creating generous breathing room between modules. The navigation is a sticky top bar with glassmorphism (backdrop-filter blur(24px)) containing a logo mark, 3 nav items as ghost buttons, 'Log In' as text link, and a white 'Get Started' primary CTA flush right.

## Agent Prompt Guide

**Quick Color Reference**
- Text primary: #ffffff
- Text body: #9f9fa0
- Text heading variant: #f5f5f7
- Background canvas: #0f1011
- Surface elevated: #2e2e2e
- Inverted surface: #cacaca
- primary action: #ffffff (filled action)
- Accent (data/charts): #00b3dd

**Example Component Prompts**

1. **Hero Section**: Obsidian canvas #0f1011 full-bleed. Centered Lyon Display 80px weight 300, #ffffff, line-height 1.0, with the first word in italic. Subhead in Suisse Int'l 18px weight 300, #9f9fa0, line-height 1.5, max-width 560px. Primary CTA below: white #ffffff fill, #000000 text, 8px radius, 12px/18px padding, arrow icon trailing.

2. **Feature Category Card**: Full-bleed Iris Gleam #847dff background, 30px border-radius, 32px padding. Lyon Display 38px weight 300 white headline. Suisse Int'l 16px weight 400 white description below at 1.5 line-height. No border, no shadow — color carries the entire card identity.

3. **AI Prompt Input**: Obsidian background #0f1011, 8px radius, 8px top/bottom and 22px left padding, 1px solid rgba(255,255,255,0.1) border. Placeholder text 'Ask anything…' in Ash #9f9fa0, Suisse Int'l 16px weight 400. Circular submit button: 100% radius, rgba(255,255,255,0.2) fill, white arrow icon.

4. Create a Primary Action Button: #ffffff background, #000000 text, 9999px radius, compact pill padding. Use this filled treatment for the main CTA.

5. **Stat Inverted Card**: Silver #cacaca background, 30px border-radius, 32px padding. Lyon Display 38px weight 300 black #000000 headline, Suisse Int'l 16px weight 400 #000000 body. Used to break the dark rhythm — maximum 1-2 per page.

## Gradient System

The system uses exactly two gradients, both subtle and structural — never decorative:

1. **Dark Chrome** — linear-gradient(135deg, rgb(43,43,44), rgb(19,19,19)): applied to product device frames and elevated chrome surfaces. Reads as machined metal in low light.

2. **Sky Atmosphere** — linear-gradient(rgb(15,16,17), rgb(19,29,39) 18%, rgb(26,71,136) 37%, rgb(64,138,193) 69%, rgb(64,138,193) 102%): used behind the hero photograph to deepen the horizon and separate the cloud layer from the page canvas.

Never apply gradients to text, buttons, or feature cards. Never use radial or conic gradients.

## Motion Philosophy

Motion is restrained and confident, not decorative. Three patterns define the system:

- **Quick state transitions**: 0.2s ease on background-color and opacity for all hover/focus states
- **Long atmospheric reveals**: 2.5s with cubic-bezier(0.455, 0.03, 0.515, 0.955) — used for hero text fade-ins and product mockup entrance
- **Border trace**: named animation 'borderTurn' that animates a 1px stroke around hexagonal or circular frames, typically for feature highlights

The 800× prevalence of plain 'ease' timing for short transitions confirms the system values predictability over spectacle. No bouncy springs, no overshoots, no parallax.

## Similar Brands

- **Wealthfront** — Same dark-canvas approach with whisper-quiet serif headlines and full-bleed feature category cards distinguished by color alone
- **Mercury** — Identical near-black surface palette, neo-grotesque sans + monospace label system, and white-on-black single primary action
- **Linear** — Same ultralight display weight anti-convention, flat elevation philosophy (color steps over shadows), and monospace micro-labels
- **Fidelity Spire** — Editorial-meets-precision typography split (serif display + sans body + mono data) applied to a dark financial interface
- **Copilot Money** — App-first dark product UI with full-bleed phone mockup bands and chromatic accent tiles per feature module

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-iris-gleam: #847dff;
  --color-cyan-signal: #00b3dd;
  --color-pale-iris: #d1c9ff;
  --color-deep-iris: #4b49aa;
  --color-orchid-bloom: #dd90d8;
  --color-periwinkle: #90b8f0;
  --color-obsidian: #0f1011;
  --color-abyss: #090a0b;
  --color-graphite: #2e2e2e;
  --color-steel: #3f4041;
  --color-silver: #cacaca;
  --color-fog: #6a6b6b;
  --color-ash: #9f9fa0;
  --color-cloud: #f5f5f7;
  --color-pure: #ffffff;
  --color-void: #000000;

  /* Typography — Font Families */
  --font-suisseintltrial: 'Suisseintltrial', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-lyon-display: 'Lyon Display', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-suisse-intl: 'Suisse Int'l', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-suisse-intl-trial: 'Suisse Int'l Trial', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-roboto-mono: 'Roboto Mono', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  --font-suisseintl: 'Suisseintl', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-mono-label: 12px;
  --leading-mono-label: 2;
  --text-body-sm: 14px;
  --leading-body-sm: 1.67;
  --text-body: 16px;
  --leading-body: 1.5;
  --text-subheading: 18px;
  --leading-subheading: 1.5;
  --text-heading-lg: 38px;
  --leading-heading-lg: 0.9;
  --text-display-sm: 80px;
  --leading-display-sm: 1;
  --text-display: 96px;
  --leading-display: 0.9;

  /* Typography — Weights */
  --font-weight-light: 300;
  --font-weight-regular: 400;
  --font-weight-medium: 500;

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
  --spacing-60: 60px;
  --spacing-68: 68px;
  --spacing-100: 100px;
  --spacing-120: 120px;
  --spacing-140: 140px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 80px;
  --card-padding: 32px;
  --element-gap: 12px;

  /* Border Radius */
  --radius-lg: 8px;
  --radius-xl: 12px;
  --radius-2xl: 16px;
  --radius-3xl: 24px;
  --radius-3xl-2: 30px;
  --radius-full: 1440px;
  --radius-full-2: 9999px;
  --radius-full-3: 14385.6px;

  /* Named Radii */
  --radius-cards: 16px;
  --radius-inputs: 8px;
  --radius-buttons: 8px;
  --radius-navitems: 8px;
  --radius-statblocks: 16px;
  --radius-pillbuttons: 9999px;
  --radius-featurecards: 30px;
  --radius-categorytiles: 30px;

  /* Shadows */
  --shadow-lg: rgba(0, 0, 0, 0.2) 0px 18px 20px 0px;

  /* Surfaces */
  --surface-obsidian-canvas: #0f1011;
  --surface-abyss: #090a0b;
  --surface-graphite-card: #2e2e2;
  --surface-steel-hover: #3f4041;
  --surface-silver-inverted: #cacaca;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-iris-gleam: #847dff;
  --color-cyan-signal: #00b3dd;
  --color-pale-iris: #d1c9ff;
  --color-deep-iris: #4b49aa;
  --color-orchid-bloom: #dd90d8;
  --color-periwinkle: #90b8f0;
  --color-obsidian: #0f1011;
  --color-abyss: #090a0b;
  --color-graphite: #2e2e2e;
  --color-steel: #3f4041;
  --color-silver: #cacaca;
  --color-fog: #6a6b6b;
  --color-ash: #9f9fa0;
  --color-cloud: #f5f5f7;
  --color-pure: #ffffff;
  --color-void: #000000;

  /* Typography */
  --font-suisseintltrial: 'Suisseintltrial', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-lyon-display: 'Lyon Display', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-suisse-intl: 'Suisse Int'l', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-suisse-intl-trial: 'Suisse Int'l Trial', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-roboto-mono: 'Roboto Mono', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  --font-suisseintl: 'Suisseintl', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-mono-label: 12px;
  --leading-mono-label: 2;
  --text-body-sm: 14px;
  --leading-body-sm: 1.67;
  --text-body: 16px;
  --leading-body: 1.5;
  --text-subheading: 18px;
  --leading-subheading: 1.5;
  --text-heading-lg: 38px;
  --leading-heading-lg: 0.9;
  --text-display-sm: 80px;
  --leading-display-sm: 1;
  --text-display: 96px;
  --leading-display: 0.9;

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
  --spacing-60: 60px;
  --spacing-68: 68px;
  --spacing-100: 100px;
  --spacing-120: 120px;
  --spacing-140: 140px;

  /* Border Radius */
  --radius-lg: 8px;
  --radius-xl: 12px;
  --radius-2xl: 16px;
  --radius-3xl: 24px;
  --radius-3xl-2: 30px;
  --radius-full: 1440px;
  --radius-full-2: 9999px;
  --radius-full-3: 14385.6px;

  /* Shadows */
  --shadow-lg: rgba(0, 0, 0, 0.2) 0px 18px 20px 0px;
}
```
