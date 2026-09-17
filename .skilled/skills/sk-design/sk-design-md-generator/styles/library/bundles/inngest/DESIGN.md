# Inngest — Style Reference
> Warm-black observatory — quiet, instrument-grade, lit by a single amber pilot light

**Theme:** dark

Inngest operates in a dim, warm-toned command-center idiom: near-black canvas with a faint umber undertone, hairline borders instead of shadows, and geometry scattered like circuit-board fragments across negative space. Type does the heavy lifting — a humanist sans (CircularXX) at 300/400 weight keeps the UI conversational while a display cut (Whyte) at 300 weight with extreme negative tracking whispers rather than shouts headlines. A single muted gold (#cab16a) is the only chromatic accent reserved for primary actions; green, red, and gold appear as decorative punctuation in floating geometric shapes, never on functional UI. Surfaces stack through four warm-tinted grays (#0c0a09 → #1c1917 → #292524 → #44403c) so cards and elevated panels read as luminance shifts, not color shifts.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Obsidian | `#0c0a09` | `--color-obsidian` | Page background, hero canvas, base surface — carries a warm umber undertone rather than neutral black so the page reads as lit, not void |
| Graphite | `#1c1917` | `--color-graphite` | Card surface, elevated panels, nav bar, footer — one step lighter than canvas to create depth without color shift |
| Charcoal | `#292524` | `--color-charcoal` | Higher elevation surfaces, input fields, nested cards — second step in the surface stack |
| Slate | `#44403c` | `--color-slate` | Tertiary surface, hover states on dark panels, subtle dividers in dense contexts |
| Stone | `#57534e` | `--color-stone` | Supporting neutral for secondary UI, dividers, and muted labels. Do not promote it to the primary CTA color |
| Ash | `#78716c` | `--color-ash` | Muted icon color, secondary metadata text, inactive stroke |
| Pebble | `#a8a29e` | `--color-pebble` | Tertiary text, captions, supporting metadata |
| Mist | `#d6d3d1` | `--color-mist` | Secondary text, link hover, subtle icon stroke |
| Fog | `#e5e7eb` | `--color-fog` | Primary text, headings, nav links — the dominant text color across the interface |
| Bone | `#f6f6f6` | `--color-bone` | High-emphasis text, button labels on dark fills, hero headline accent |
| Pure | `#ffffff` | `--color-pure` | Maximum contrast text, logo wordmark, high-priority callouts |
| Pilot Gold | `#cab16a` | `--color-pilot-gold` | Yellow supporting accent for decorative details and low-frequency emphasis |
| Circuit Green | `#89b482` | `--color-circuit-green` | Decorative geometry only — floating triangle/quarter-circle accents in hero and section backgrounds; never used on buttons or states |
| Signal Red | `#ea6962` | `--color-signal-red` | Red supporting accent for decorative details and low-frequency emphasis |

## Tokens — Typography

### CircularXX — Workhorse sans for body, nav, buttons, cards, and form labels. Weight 400 is the UI default; 500 for button text and emphasized labels; 300 appears in the logotype wordmark. The slight negative tracking (-0.019em) tightens the humanist forms into a more instrumented feel. · `--font-circularxx`
- **Substitute:** Inter, Söhne, General Sans
- **Weights:** 300, 400, 500, 600
- **Sizes:** 12, 14, 16, 18, 20, 24, 72
- **Line height:** 1.20–1.75
- **Letter spacing:** -0.019em
- **Role:** Workhorse sans for body, nav, buttons, cards, and form labels. Weight 400 is the UI default; 500 for button text and emphasized labels; 300 appears in the logotype wordmark. The slight negative tracking (-0.019em) tightens the humanist forms into a more instrumented feel.

### Whyte — Display face for hero headlines and section titles. Weight 300 at 72px with -0.056em tracking is the signature move: anti-convention for a dev tool, where most competitors use 700-800. The whisper-weight display creates authority through restraint — the type breathes instead of pushing. · `--font-whyte`
- **Substitute:** Söhne, GT America, Switzer
- **Weights:** 300, 400, 600, 700
- **Sizes:** 16, 24, 30, 36, 48, 72
- **Line height:** 1.00–1.50
- **Letter spacing:** -0.056em at display, -0.025em at subhead
- **Role:** Display face for hero headlines and section titles. Weight 300 at 72px with -0.056em tracking is the signature move: anti-convention for a dev tool, where most competitors use 700-800. The whisper-weight display creates authority through restraint — the type breathes instead of pushing.

### Whyte Inktrap — Mid-size headings (30-60px) where the inktrap terminals prevent thin strokes from closing up at smaller display sizes. Bridges the gap between the light display weight and readable mid-size headings. · `--font-whyte-inktrap`
- **Substitute:** Söhne Breit, GT America Expanded
- **Weights:** 400, 500, 600
- **Sizes:** 18, 30, 36, 48, 60
- **Line height:** 1.00–1.56
- **Letter spacing:** -0.056em at display, -0.025em at mid
- **Role:** Mid-size headings (30-60px) where the inktrap terminals prevent thin strokes from closing up at smaller display sizes. Bridges the gap between the light display weight and readable mid-size headings.

### CircularXXMono — Code snippets, monospaced labels, technical metadata, version strings. Limited to 12-18px — always auxiliary, never structural. · `--font-circularxxmono`
- **Substitute:** JetBrains Mono, IBM Plex Mono
- **Weights:** 400
- **Sizes:** 12, 14, 18
- **Line height:** 1.33–1.63
- **Letter spacing:** normal
- **Role:** Code snippets, monospaced labels, technical metadata, version strings. Limited to 12-18px — always auxiliary, never structural.

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 12px | 1.5 | -0.019px | `--text-caption` |
| body-sm | 14px | 1.56 | -0.019px | `--text-body-sm` |
| body | 16px | 1.5 | -0.019px | `--text-body` |
| subheading | 20px | 1.4 | -0.025px | `--text-subheading` |
| heading-sm | 24px | 1.33 | -0.025px | `--text-heading-sm` |
| heading | 36px | 1.2 | -0.056px | `--text-heading` |
| heading-lg | 48px | 1.11 | -0.056px | `--text-heading-lg` |
| display | 72px | 1 | -0.056px | `--text-display` |

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
| 64 | 64px | `--spacing-64` |
| 80 | 80px | `--spacing-80` |
| 96 | 96px | `--spacing-96` |
| 128 | 128px | `--spacing-128` |
| 144 | 144px | `--spacing-144` |
| 160 | 160px | `--spacing-160` |
| 192 | 192px | `--spacing-192` |

### Border Radius

| Element | Value |
|---------|-------|
| tags | 9999px |
| cards | 12px |
| inputs | 4px |
| buttons | 9999px |

### Shadows

| Name | Value | Token |
|------|-------|-------|
| subtle | `rgba(0, 0, 0, 0.05) 0px 1px 2px 0px` | `--shadow-subtle` |
| subtle-2 | `rgba(0, 0, 0, 0.1) 0px 1px 3px 0px, rgba(0, 0, 0, 0.1) 0p...` | `--shadow-subtle-2` |
| xl | `rgba(0, 0, 0, 0.1) 0px 20px 25px -5px, rgba(0, 0, 0, 0.1)...` | `--shadow-xl` |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 80-120px
- **Card padding:** 32px
- **Element gap:** 16-24px

## Components

### Primary Pill Button
**Role:** Hero and section CTAs (e.g., 'Start building for free', 'Sign up')

Pill shape (9999px radius), Pilot Gold (#cab16a) fill, #0c0a09 text, CircularXX weight 500 at 14-16px, horizontal padding 20px, vertical padding 10px. No border. No shadow. The gold against warm-black is the page's only chromatic permission — used sparingly so it always feels switched on.

### Ghost Outline Button
**Role:** Secondary CTAs (e.g., 'Get a demo', 'Contact us')

Pill shape (9999px radius), transparent fill, 1px border in #44403c, Fog (#e5e7eb) text, CircularXX weight 400 at 14-16px, padding 20px horizontal / 10px vertical. Hover lifts border to #78716c.

### Nav Link
**Role:** Top navigation items and footer links

CircularXX weight 400 at 14px, Mist (#d6d3d1) default, Fog (#e5e7eb) hover, no underline. Padding 12px horizontal. Active page uses Pilot Gold underline or text color.

### Feature Card
**Role:** 3-column grid cards in feature sections (Infraless, Agnostic, Observable)

Graphite (#1c1917) fill, 1px border in #292524, 12px radius, padding 32px. Icon at top in single chromatic color (green or gold) at 24px, CircularXX weight 500 at 20px heading, 14px body in #a8a29e. No shadow — depth comes from the surface stack.

### Trust Credential Card
**Role:** Enterprise feature items in 'Built for trust' section

Transparent fill, 1px border-bottom in #292524 (hairline divider pattern), padding 16px vertical / 24px horizontal. Heading in CircularXX uppercase at 12px, weight 500, +0.05em tracking. Body in #a8a29 at 14px.

### Open Source Badge
**Role:** Nav bar GitHub link with star count

Ghost outline (1px #44403c border), pill radius, CircularXX at 14px, Fog text, small GitHub icon. Padding 8px 16px. Star count in #d6d3d1.

### Hero Headline
**Role:** 72px display headline on hero sections

Whyte weight 300 at 72px, line-height 1.0, letter-spacing -0.056em, color Fog (#e5e7eb). Two-line layout with line break creating a deliberate pause. Sets the whisper-weight authority for the entire site.

### Section Subtitle
**Role:** Descriptive paragraph below section headings

CircularXX weight 400 at 18px, line-height 1.56, color #a8a29e. Max-width ~640px when used as a lead paragraph under a centered heading.

### Customer Logo Strip
**Role:** Row of trusted-by company logos in hero and dedicated section

Horizontal flex row, logos in Fog (#e5e7eb) or white at 60-70% opacity, consistent baseline height ~20px, gap 32-48px. No borders or cards — logos sit directly on canvas with breathing room.

### Decorative Geometry
**Role:** Background scatter elements in hero and section headers

Floating quarter-circles and right-triangles in Pilot Gold (#cab16a), Circuit Green (#89b482), and Signal Red (#ea6962). Absolutely positioned, 40-80px size, partially clipped by section edges. 15-20% opacity in some placements. Never overlap text or interactive elements.

### Inline Code Token
**Role:** Function names, file references, and method calls within body text

CircularXXMono at 14px, text in #d8a657 (warm amber) to distinguish from regular body text. No background pill — inline within the sentence flow.

### Nav Dropdown Indicator
**Role:** Chevron on nav items with submenus (Platform, Resources)

4px solid downward chevron, 1.5px stroke weight, color #78716c default, Mist on hover. Sits 4px right of the nav link text.

## Do's and Don'ts

### Do
- Use Pilot Gold (#cab16a) exclusively for primary action fills — it is the only chromatic color permitted on functional UI elements
- Set hero headlines at 72px Whyte weight 300 with -0.056em tracking; the whisper-weight display is the site's signature voice
- Layer surfaces using the warm-gray stack (#0c0a09 → #1c1917 → #292524 → #44403c) to create depth without introducing hue
- Use 9999px radius for all buttons, badges, and tags to maintain the pill-shape consistency
- Set body text at 16px CircularXX weight 400 with -0.019em tracking; never go below 14px for readable content
- Place floating geometric shapes (triangles, quarter-circles) in gold, green, and red as background atmosphere — they are decorative, not informative
- Maintain 80-120px vertical breathing room between major sections to preserve the observatory spaciousness

### Don't
- Do not use green (#89b482) or red (#ea6962) on buttons, badges, or status indicators — they are decorative-only and lose meaning if repurposed
- Do not use bold (700+) weights for headlines — the entire display system is built on the restraint of weight 300
- Do not introduce drop shadows beyond the single subtle nav shadow (rgba(0,0,0,0.05) 0 1px 2px); depth comes from surface stack, not blur
- Do not use pure #000000 as a background — the warm undertone of #0c0a09 is what makes the dark theme feel lit rather than void
- Do not set body text below 14px or use weights above 500 for paragraphs — the type system is designed for quiet scanning, not shouting
- Do not place text directly over decorative geometry — always maintain 40px+ clear space between type and floating shapes
- Do not add gradients to functional UI elements; the palette is deliberately flat, letting the gold accent do the chromatic work

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Canvas | `#0c0a09` | Page background, hero sections, full-bleed bands |
| 1 | Card | `#1c1917` | Feature cards, pricing panels, content blocks sitting on canvas |
| 2 | Elevated | `#292524` | Nested elements, hover states, input fields, code blocks |
| 3 | Overlay | `#44403c` | Modals, popovers, highest elevation surfaces |

## Elevation

- **Sticky Nav:** `rgba(0, 0, 0, 0.05) 0px 1px 2px 0px`
- **Button Hover:** `rgba(0, 0, 0, 0.1) 0px 1px 3px 0px, rgba(0, 0, 0, 0.1) 0px 1px 2px -1px`
- **Feature Card (active/expanded state):** `rgba(0, 0, 0, 0.1) 0px 20px 25px -5px, rgba(0, 0, 0, 0.1) 0px 8px 10px -6px`

## Imagery

The site is almost entirely typographic and geometric — no photography, no product screenshots, no illustrations. The visual language is built from scattered geometric primitives (quarter-circles, right-triangles) in gold, green, and red that float around hero and section backgrounds like circuit-board fragments. These shapes are partially clipped by section edges, creating a sense of a larger pattern extending beyond the viewport. Icons are minimal and single-color: 24px, 1.5px stroke, outline style in green or gold to match the decorative palette. The customer logo strip is the only repeated photographic content, rendered flat-white at reduced opacity. The overall effect is text-dominant with geometric atmosphere — the interface itself is the visual.

## Layout

The page follows a single-column, centered max-width (1200px) structure with full-bleed dark bands. The hero is centered text-only with the 72px headline and scattered geometric shapes floating in the negative space. Sections alternate between centered headline+subhead compositions and left-aligned text+content blocks. Feature sets use a 3-column equal-width card grid with 24px gaps. The trust/credentials section uses a 2-column grid (label+description pairs). Customer logos sit in a single horizontal row below the hero and in a dedicated section with carousel controls. Vertical rhythm is generous — 80-120px between sections — creating a spacious observatory feel rather than a dense information layout. The sticky top nav is minimal: logo left, platform/resources dropdowns center-left, GitHub badge + sign-in + sign-up right.

## Agent Prompt Guide

**Quick Color Reference**
- text: #e5e7eb (Fog)
- background: #0c0a09 (Obsidian)
- card surface: #1c1917 (Graphite)
- border: #292524 (Charcoal)
- primary action: no distinct CTA color
- accent: #cab16a (Pilot Gold) — same as primary action

**3-5 Example Component Prompts**

1. Create a hero section: Obsidian (#0c0a09) background. Centered headline at 72px Whyte weight 300, color Fog (#e5e7eb), letter-spacing -0.056em, line-height 1.0. Subtitle at 18px CircularXX weight 400, color #a8a29e. Two buttons: primary pill with Pilot Gold (#cab16a) fill, #0c0a09 text at 14px CircularXX weight 500, padding 10px 20px; secondary ghost pill with 1px #44403c border, Fog text. Scatter 4-6 decorative shapes (quarter-circles and triangles) in gold (#cab16a), green (#89b482), and red (#ea6962) around the hero edges at 40-80px size.

2. Create a feature card grid: 3 equal columns with 24px gap. Each card uses Graphite (#1c1917) fill, 1px Charcoal (#292524) border, 12px radius, 32px padding. Icon at top in Circuit Green (#89b482) at 24px outline style. Heading in CircularXX weight 500 at 20px, Fog text. Body at 14px CircularXX weight 400, color #a8a29e.

3. Create a nav bar: Obsidian (#0c0a09) background, 1px bottom border in #292524, hairline shadow rgba(0,0,0,0.05) 0 1px 2px. Logo 'INGEST' in white CircularXX at 18px weight 600 left. Center: nav links in CircularXX 14px weight 400, Mist (#d6d3d1) color. Right: GitHub ghost badge (1px #44403c border, pill radius, 8px 16px padding) + Ghost outline 'Sign in' + Primary pill 'Sign up' in Pilot Gold.

4. Create a trust credentials section: 2-column grid with 40px row gaps. Each row: left column has uppercase CircularXX at 12px weight 500, +0.05em tracking, Fog color. Right column has body text at 14px CircularXX weight 400, #a8a29e color. Rows separated by 1px #292524 bottom border.

5. Create a decorative background layer: 8 geometric shapes absolutely positioned in a full-bleed section. Mix of quarter-circles (40-60px radius) and right-triangles (30-50px) in Pilot Gold (#cab16a), Circuit Green (#89b482), and Signal Red (#ea6962). Positions should be 20-30% from edges, partially clipped by the viewport. No shape should overlap text content areas.

## Decorative Geometry System

The scattered shapes are not random — they form a vocabulary. Three shape types (quarter-circle, right-triangle, small filled square) in three colors (Pilot Gold, Circuit Green, Signal Red) at three sizes (40px, 60px, 80px) create combinatorial variety from minimal primitives. Always position shapes so they are partially clipped by a section edge — this implies the pattern continues beyond the viewport and prevents the shapes from feeling like stickers placed on the page. Never center a shape. Never place two same-color shapes adjacent. Maintain at least 200px between shapes to preserve negative space.

## Similar Brands

- **Linear** — Same dark warm-toned canvas (#0c0a09 family), whisper-weight display headlines, single accent color reserved exclusively for primary CTAs, and geometric decorative elements scattered in negative space
- **Vercel** — Similar full-bleed dark sections with generous 80-120px vertical rhythm, centered hero pattern, and minimal surface elevation relying on hairline borders rather than shadows
- **Resend** — Dev-tool brand using warm-black backgrounds, pill-shaped buttons, and a single muted chromatic accent (Resend uses white, Inngest uses gold) against a near-identical typographic restraint
- **Cal.com** — Same approach to floating geometric primitives as background atmosphere, warm-neutral dark palette, and humanist sans-serif as the UI workhorse

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-obsidian: #0c0a09;
  --color-graphite: #1c1917;
  --color-charcoal: #292524;
  --color-slate: #44403c;
  --color-stone: #57534e;
  --color-ash: #78716c;
  --color-pebble: #a8a29e;
  --color-mist: #d6d3d1;
  --color-fog: #e5e7eb;
  --color-bone: #f6f6f6;
  --color-pure: #ffffff;
  --color-pilot-gold: #cab16a;
  --color-circuit-green: #89b482;
  --color-signal-red: #ea6962;

  /* Typography — Font Families */
  --font-circularxx: 'CircularXX', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-whyte: 'Whyte', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-whyte-inktrap: 'Whyte Inktrap', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-circularxxmono: 'CircularXXMono', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.5;
  --tracking-caption: -0.019px;
  --text-body-sm: 14px;
  --leading-body-sm: 1.56;
  --tracking-body-sm: -0.019px;
  --text-body: 16px;
  --leading-body: 1.5;
  --tracking-body: -0.019px;
  --text-subheading: 20px;
  --leading-subheading: 1.4;
  --tracking-subheading: -0.025px;
  --text-heading-sm: 24px;
  --leading-heading-sm: 1.33;
  --tracking-heading-sm: -0.025px;
  --text-heading: 36px;
  --leading-heading: 1.2;
  --tracking-heading: -0.056px;
  --text-heading-lg: 48px;
  --leading-heading-lg: 1.11;
  --tracking-heading-lg: -0.056px;
  --text-display: 72px;
  --leading-display: 1;
  --tracking-display: -0.056px;

  /* Typography — Weights */
  --font-weight-light: 300;
  --font-weight-regular: 400;
  --font-weight-medium: 500;
  --font-weight-semibold: 600;
  --font-weight-bold: 700;

  /* Spacing */
  --spacing-unit: 8px;
  --spacing-8: 8px;
  --spacing-16: 16px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-40: 40px;
  --spacing-48: 48px;
  --spacing-64: 64px;
  --spacing-80: 80px;
  --spacing-96: 96px;
  --spacing-128: 128px;
  --spacing-144: 144px;
  --spacing-160: 160px;
  --spacing-192: 192px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 80-120px;
  --card-padding: 32px;
  --element-gap: 16-24px;

  /* Border Radius */
  --radius-md: 4px;
  --radius-xl: 12px;
  --radius-full: 9999px;

  /* Named Radii */
  --radius-tags: 9999px;
  --radius-cards: 12px;
  --radius-inputs: 4px;
  --radius-buttons: 9999px;

  /* Shadows */
  --shadow-subtle: rgba(0, 0, 0, 0.05) 0px 1px 2px 0px;
  --shadow-subtle-2: rgba(0, 0, 0, 0.1) 0px 1px 3px 0px, rgba(0, 0, 0, 0.1) 0px 1px 2px -1px;
  --shadow-xl: rgba(0, 0, 0, 0.1) 0px 20px 25px -5px, rgba(0, 0, 0, 0.1) 0px 8px 10px -6px;

  /* Surfaces */
  --surface-canvas: #0c0a09;
  --surface-card: #1c1917;
  --surface-elevated: #292524;
  --surface-overlay: #44403c;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-obsidian: #0c0a09;
  --color-graphite: #1c1917;
  --color-charcoal: #292524;
  --color-slate: #44403c;
  --color-stone: #57534e;
  --color-ash: #78716c;
  --color-pebble: #a8a29e;
  --color-mist: #d6d3d1;
  --color-fog: #e5e7eb;
  --color-bone: #f6f6f6;
  --color-pure: #ffffff;
  --color-pilot-gold: #cab16a;
  --color-circuit-green: #89b482;
  --color-signal-red: #ea6962;

  /* Typography */
  --font-circularxx: 'CircularXX', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-whyte: 'Whyte', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-whyte-inktrap: 'Whyte Inktrap', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-circularxxmono: 'CircularXXMono', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.5;
  --tracking-caption: -0.019px;
  --text-body-sm: 14px;
  --leading-body-sm: 1.56;
  --tracking-body-sm: -0.019px;
  --text-body: 16px;
  --leading-body: 1.5;
  --tracking-body: -0.019px;
  --text-subheading: 20px;
  --leading-subheading: 1.4;
  --tracking-subheading: -0.025px;
  --text-heading-sm: 24px;
  --leading-heading-sm: 1.33;
  --tracking-heading-sm: -0.025px;
  --text-heading: 36px;
  --leading-heading: 1.2;
  --tracking-heading: -0.056px;
  --text-heading-lg: 48px;
  --leading-heading-lg: 1.11;
  --tracking-heading-lg: -0.056px;
  --text-display: 72px;
  --leading-display: 1;
  --tracking-display: -0.056px;

  /* Spacing */
  --spacing-8: 8px;
  --spacing-16: 16px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-40: 40px;
  --spacing-48: 48px;
  --spacing-64: 64px;
  --spacing-80: 80px;
  --spacing-96: 96px;
  --spacing-128: 128px;
  --spacing-144: 144px;
  --spacing-160: 160px;
  --spacing-192: 192px;

  /* Border Radius */
  --radius-md: 4px;
  --radius-xl: 12px;
  --radius-full: 9999px;

  /* Shadows */
  --shadow-subtle: rgba(0, 0, 0, 0.05) 0px 1px 2px 0px;
  --shadow-subtle-2: rgba(0, 0, 0, 0.1) 0px 1px 3px 0px, rgba(0, 0, 0, 0.1) 0px 1px 2px -1px;
  --shadow-xl: rgba(0, 0, 0, 0.1) 0px 20px 25px -5px, rgba(0, 0, 0, 0.1) 0px 8px 10px -6px;
}
```
