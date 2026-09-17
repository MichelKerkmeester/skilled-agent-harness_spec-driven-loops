# Modal — Style Reference
> Phosphor terminal in a darkened server room — the vivid green is the only light source.

**Theme:** dark

Modal operates as a phosphorescent terminal in a darkened server room: near-black canvas, phosphor-pale green type, and a single vivid lime accent that behaves like an LED status indicator. The design language is developer-native — monospaced code windows with traffic-light dots, isometric 3D icons rendered in the brand green, and generous negative space that lets one element per section glow. Typography is split between a custom display face (Goga) for headlines and a variable Inter for all UI chrome, both tuned with tight negative tracking. Color is rationed: most screens are achromatic, and the vivid lime green appears only on primary actions, the logo, 3D illustrations, and emphasis moments. Components are flat and borderless, relying on hairline green-tinted borders and backdrop blur rather than shadows for depth.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Void Black | `#000000` | `--color-void-black` | Page canvas, deepest background layer |
| Ground Iron | `#181818` | `--color-ground-iron` | Primary button fill, card surfaces on dark sections, base UI surface |
| Carbon Veil | `#212525` | `--color-carbon-veil` | Elevated surfaces, nav background, subtly lighter than ground |
| Circuit Border | `#485346` | `--color-circuit-border` | Outlined/ghost action border, primary interactive hairline — muted green-tinted gray |
| Phosphor Blue-Black | `#1f2a33` | `--color-phosphor-blue-black` | Secondary hairline borders, separator strokes between dark bands |
| Charcoal Rust | `#231c1c` | `--color-charcoal-rust` | Subtle warm-tinted dark accent for code-window inner panels |
| Lime Pulse | `#7fee64` | `--color-lime-pulse` | Primary brand accent — logo mark, hero CTA pill, tag fills, active states, illustration base color |
| Phosphor White | `#ddffdc` | `--color-phosphor-white` | Primary text, heading color, icon strokes, filled button text — the dominant readable surface |
| Mint Frost | `#def0dd` | `--color-mint-frost` | Card surface tint on light sections, secondary text on dark, soft highlight wash |
| Sage 60 | `#8cab87` | `--color-sage-60` | Body copy default — readable muted green-gray for paragraphs on dark canvas |
| Sage 40 | `#677d64` | `--color-sage-40` | Muted helper text, secondary descriptions, low-priority body content |
| Moss 70 | `#9cbf93` | `--color-moss-70` | Eyebrow labels, category tags above section headings |
| Moss 80 | `#aed2a4` | `--color-moss-80` | Lead paragraph text, hero subhead — the brightest muted green for lead copy |
| Fern Link | `#859984` | `--color-fern-link` | Inline link text, tertiary navigation links on dark |
| Deep Fern | `#697368` | `--color-deep-fern` | Small uppercase labels, micro-copy, footer text |
| Pine 15 | `#3e4a3c` | `--color-pine-15` | Secondary outlined action border, low-emphasis interactive hairline |

## Tokens — Typography

### Goga — Display and heading face — used for all H1–H4 and card titles. Goga is a custom geometric sans with tight apertures and slightly squared terminals. The medium weight (500) is reserved for emphasis on card-level titles; the regular weight (400) handles hero and section headings. Its 'ss01' stylistic set should be enabled to access alternate glyph forms that define Modal's identity. Negative tracking tightens progressively from -0.007em at 48px to -0.017em at 21px. · `--font-goga`
- **Substitute:** Inter Tight or Space Grotesk
- **Weights:** 400, 500
- **Sizes:** 20, 21, 24, 28, 30, 36, 40, 42, 48, 54, 64
- **Line height:** 1.00, 1.05, 1.10, 1.20, 1.25, 1.30, 1.50
- **Letter spacing:** -0.017em at 21px, -0.013em at 24px, -0.012em at 30px, -0.009em at 36px, -0.008em at 42px, -0.007em at 48px
- **OpenType features:** `"ss01"`
- **Role:** Display and heading face — used for all H1–H4 and card titles. Goga is a custom geometric sans with tight apertures and slightly squared terminals. The medium weight (500) is reserved for emphasis on card-level titles; the regular weight (400) handles hero and section headings. Its 'ss01' stylistic set should be enabled to access alternate glyph forms that define Modal's identity. Negative tracking tightens progressively from -0.007em at 48px to -0.017em at 21px.

### Inter Variable — UI and body face — nav, buttons, body copy, labels, footer. Medium weight (500) is the default for interactive elements and nav; regular (400) for paragraphs. Tracking is notably tight even at small sizes (-0.026em at 14px, -0.022em at 16px) giving the UI a compressed, terminal-like density. The 'cv11' character variant should be enabled for alternate punctuation. Uppercase eyebrow labels at 12px use +0.05em tracking as a counter-rhythm to the body tightness. · `--font-inter-variable`
- **Substitute:** Inter
- **Weights:** 400, 500
- **Sizes:** 12, 14, 16, 20
- **Line height:** 1.25, 1.33, 1.43, 1.50
- **Letter spacing:** -0.026em at 14px, -0.022em at 16px, -0.018em at 20px, +0.05em at 12px (uppercase)
- **OpenType features:** `"cv11"`
- **Role:** UI and body face — nav, buttons, body copy, labels, footer. Medium weight (500) is the default for interactive elements and nav; regular (400) for paragraphs. Tracking is notably tight even at small sizes (-0.026em at 14px, -0.022em at 16px) giving the UI a compressed, terminal-like density. The 'cv11' character variant should be enabled for alternate punctuation. Uppercase eyebrow labels at 12px use +0.05em tracking as a counter-rhythm to the body tightness.

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 12px | 1.33 | 0.6px | `--text-caption` |
| body-sm | 14px | 1.43 | -0.364px | `--text-body-sm` |
| body | 16px | 1.5 | -0.352px | `--text-body` |
| subheading | 20px | 1.5 | -0.36px | `--text-subheading` |
| heading-sm | 24px | 1.3 | -0.312px | `--text-heading-sm` |
| heading | 30px | 1.2 | -0.36px | `--text-heading` |
| heading-lg | 42px | 1.05 | -0.336px | `--text-heading-lg` |
| display | 64px | 1 | -0.448px | `--text-display` |

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
| 36 | 36px | `--spacing-36` |
| 40 | 40px | `--spacing-40` |
| 48 | 48px | `--spacing-48` |
| 56 | 56px | `--spacing-56` |
| 64 | 64px | `--spacing-64` |
| 96 | 96px | `--spacing-96` |
| 128 | 128px | `--spacing-128` |
| 160 | 160px | `--spacing-160` |

### Border Radius

| Element | Value |
|---------|-------|
| cards | 8px |
| icons | 0px |
| pills | 9999px |
| inputs | 8px |
| buttons | 12px |

### Shadows

| Name | Value | Token |
|------|-------|-------|
| md | `rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.1)...` | `--shadow-md` |

### Layout

- **Page max-width:** 1280px
- **Section gap:** 80px
- **Card padding:** 32px
- **Element gap:** 20px

## Components

### Primary Filled Button
**Role:** Default CTA across the application

Background #181818 (Ground Iron), text and border #ddffdc (Phosphor White), 1px solid border, 12px radius, 32px padding on all sides. Text is Inter Variable 16px weight 500, letter-spacing -0.352px. The dark fill with phosphor border creates an 'engraved into the dark' appearance — the button is present but doesn't shout, letting the page's single lime accent do the emphasis work.

### Ghost Outline Button
**Role:** Secondary action paired with the primary button

Transparent background, 1px border in #ddffdc, text #ddffdc, 12px radius, 32px padding. Inter Variable 16px weight 500. Used in CTA pairs like 'Get Started' + 'Contact Us' where the filled button takes the lead. The phosphor border maintains the glow metaphor without filling space.

### Accent Pill Button
**Role:** Hero CTA and high-conversion single-action moments

Full pill radius (9999px), background #7fee64 (Lime Pulse), text in dark (#181818 or #000000), 12–16px vertical padding, 20–24px horizontal padding. Inter Variable 16px weight 500. This is the only component that uses the vivid green as a fill — treat it as rationed: one per viewport maximum.

### Outlined Ghost Link
**Role:** Inline action affordance for navigation, 'Learn More' style links

Transparent background, 1px border in #485346 (Circuit Border) at reduced opacity, 9999px radius, 8px padding. Text in #859984 (Fern Link). Inter Variable 14px weight 500. The green-tinted hairline border makes links discoverable without competing with buttons.

### Navigation Bar
**Role:** Top-level site navigation

Background #212525 (Carbon Veil) with 10px backdrop blur, 1px bottom border in #1f2a33. Full-width, fixed/sticky. Logo (green 3D mark + 'Modal' wordmark in Phosphor White) on left, nav links (Inter 14px weight 500, #ddffdc) centered, Login + Sign Up on right. The Sign Up is the Accent Pill Button variant. Height approximately 64px with 24px horizontal padding.

### Hero Section
**Role:** Above-the-fold brand statement and primary conversion

Full-bleed #000000 canvas with centered text stack. Headline Goga 64px weight 500, lh 1.0, with the first two words in #7fee64 (Lime Pulse) and the rest in #ddffdc — the lime phrase acts as a status LED. Subhead in Inter 20px weight 400, #aed2a4 (Moss 80), max-width ~640px centered. Two CTAs side by side: Accent Pill + Ghost Outline. Below the text sits a 3D glowing cube (the signature visual) with a radial gradient halo (rgba(195,198,64,0.85) fading to transparent). The cube uses the marketing gradient (#80ee64 → #18b759 → #09af58) and casts a green bloom onto the void.

### Code Window Card
**Role:** Display SDK code snippets, benchmark results, terminal mockups

Rounded panel (~12–16px radius) with dark interior (#181818 or #212525) and 1px hairline border in #485346. Top bar shows three traffic-light dots (using the red-5/green/yellow tinted neutrals or just colored circles). Content uses monospace font (Fira Mono), syntax-highlighted with #7fee64 for keywords, #ddffdc for strings, #677d64 for comments. Optional title bar text right-aligned in #9cbf93. No shadow — depth comes from the border hairline.

### Workload Card
**Role:** Product capability cards (Inference, Training, Sandboxes)

Dark surface (#1f2a33 or #181818), 8px radius, no border or optional 1px #485346. Top half is a 3D isometric icon on a colored ground: green wireframe cube (Inference), solid green stairs (Training), stacked green layers (Sandboxes). Title in Goga 24px weight 400, #ddffdc. Description in Inter 16px weight 400, #8cab87 (Sage 60). 32px padding. Cards sit in a 3-column grid with 20–24px gap.

### Eyebrow Label
**Role:** Category or section identifier above headings

Inter Variable 12px weight 500, uppercase, letter-spacing 0.6px (+0.05em), color #9cbf93 (Moss 70). Acts as a section's tag/chip — small, widely tracked, muted green. Always sits 8–12px above the heading it qualifies.

### Customer Logo Strip
**Role:** Social proof — logos of companies using the platform

Two-row grid of customer logos rendered in #697368 (Deep Fern) or #859984 — a desaturated green-gray that lets logos recede into the dark canvas. Logos are at uniform height (~20–24px) with consistent 40–60px horizontal spacing. No borders, no backgrounds. The muted treatment signals 'proof without ego'.

### Section Divider
**Role:** Visual separator between content bands

1px horizontal line in #1f2a33 (Phosphor Blue-Black) spanning the content max-width. Used sparingly between light and dark section transitions. No decorative weight — purely functional.

### Tag/Chip
**Role:** Status indicators, category labels, feature flags

Full pill radius (9999px), background #7fee64 (Lime Pulse) for active/positive tags, or transparent with #485346 border for neutral tags. Text Inter 12px weight 500. Padding 4px 12px. The green fill is rationed — use for status (running, active, live) not decoration.

## Do's and Don'ts

### Do
- Use #7fee64 (Lime Pulse) as a fill on exactly one element per viewport — the hero CTA pill, an active tag, or the logo. Never tile it across a surface.
- Set Inter font-feature-settings to 'cv11' and Goga to 'ss01' globally — these variants are part of the brand identity, not optional.
- Default body text to #8cab87 (Sage 60) on #000000 — the 19:1 contrast ratio means readability is never a concern; the muted green is the readable state.
- Render headlines in Goga with negative tracking (-0.336px at 42px, -0.448px at 64px) — the tight setting is signature, not optional.
- Use 12px radius for buttons and 8px for cards — these two values define the geometry. Do not introduce new radius tokens.
- Communicate depth through surface value shifts (#000000 → #181818 → #212525) and 1px #485346 hairlines. Reach for shadows only on the nav bar.
- Use 32px padding on primary cards and content blocks. The comfortable density is non-negotiable — cramped layouts break the terminal metaphor.

### Don't
- Do not use the vivid lime (#7fee64) as a text color on body copy — it is for fills, the logo, and the hero phrase only.
- Do not apply drop shadows to cards, buttons, or content blocks. The system uses one shadow (nav bar) and that is the ceiling.
- Do not introduce blue, purple, or any non-green chromatic accents. The system is monochromatic green-on-black by design.
- Do not use #ddffdc (Phosphor White) for body paragraphs — it is reserved for headings, icons, and button text. Body copy must use the muted sage scale (#8cab87, #677d64).
- Do not set text in Inter for display headings. Goga is mandatory for H1–H4 and card titles; Inter handles only UI chrome and body.
- Do not use fully rounded corners (9999px) on cards or panels. Pill radius is reserved for CTAs, tags, and link chips only.
- Do not use raw white #ffffff or pure green #00ff00. The phosphor palette is deliberately desaturated and slightly warm — saturated primaries look alien against the void canvas.

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Void | `#000000` | Deepest page canvas, hero background, full-bleed dark sections |
| 1 | Ground | `#181818` | Primary UI surface, filled button background, standard card surface on dark |
| 2 | Carbon | `#212525` | Elevated surface for nav bar, code window interiors, selected states |
| 3 | Mint Frost | `#def0dd` | Light section canvas (alternate surface), soft card tint |
| 4 | Lime Pulse | `#7fee64` | Highest-emphasis accent surface — active CTA pill, tag fills |

## Elevation

- **Navigation Bar:** `rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.1) 0px 4px 6px -4px`

## Imagery

Modal's visual language is split between two modes: 3D glowing product renderings and dark code-window mockups. The hero centers on a single 3D cube rendered with the marketing gradient (lime-to-emerald), sitting in a radial gradient halo that blooms green light onto the void canvas — this is the brand's signature visual. Workload cards feature isometric 3D icons (wireframe cube, solid stairs, stacked layers) rendered in the same lime green, sitting on dark grounds. Code and benchmark displays are presented as terminal-window cards with traffic-light dots, monospaced syntax highlighting in the phosphor palette, and a muted green border — they feel like screenshots of a real CLI. Customer logos appear as desaturated green-gray marks on a single low-contrast row, signaling credibility without visual competition. The overall density is low — most pages are text-dominant with imagery appearing as singular focal objects rather than grids of photos. There is no photography; the entire visual system is rendered, geometric, and emissive.

## Layout

Modal uses a full-bleed dark layout with max-width 1280px content containment. The hero is centered-stack: headline (with the first phrase in lime), subhead, dual CTAs, and a single 3D object as the visual anchor — no split layouts, no sidebar. Content sections follow a consistent rhythm: eyebrow label (uppercase, Moss 70) → Goga heading → muted body copy, then either a 2-column feature layout (text + code/visual card) or a 3-column card grid. Section gaps are generous at 80px. The page alternates between deep void (#000000) and slightly lighter ground (#181818) bands, with one light section (#def0dd) appearing mid-page as a visual breath. Navigation is a single fixed top bar with backdrop blur — no sidebar, no mega-menu. Footer is compact, dark, with link columns in muted green. The density is comfortable: each section gets room to breathe, and no more than 3 columns are ever used for card grids.

## Agent Prompt Guide

primary action: #181818 (filled action)
Create a Primary Action Button: #181818 background, #859984 text, 9999px radius, compact pill padding. Use this filled treatment for the main CTA.
## Quick Color Reference
- background: #000000
- surface: #181818
- elevated surface: #212525
- text primary: #ddffdc
- text body: #8cab87
- border: #485346
- accent: #7fee64 (Lime Pulse — rationed, one per viewport)

## 3-5 Example Component Prompts

**1. Hero Section**: Full-bleed #000000 canvas, centered stack. Headline at 64px Goga weight 500, lh 1.0, letter-spacing -0.448px — first two words in #7fee64, remainder in #ddffdc. Subhead at 20px Inter weight 400, #aed2a4, max-width 640px, centered. Two buttons side by side with 12px gap: lime accent pill (#7fee64 bg, #181818 text, 9999px radius, 16px 24px padding, Inter 16px weight 500) followed by ghost outline button (#ddffdc border, transparent bg, 12px radius, 32px padding). Below, a centered 3D lime cube with radial green glow.

**2. Code Window Card**: 16px radius panel, #181818 background, 1px solid #485346 border. Top bar: 12px height, 8px 16px padding, three 8px traffic-light dots (left-aligned). Content area: 24px padding, monospace text (Fira Mono) at 14px, line-height 1.5. Keywords in #7fee64, strings in #ddffdc, comments in #677d64. Optional right-aligned title in #9cbf93 at 12px Inter weight 500.

**3. Workload Card**: 8px radius, #1f2a33 background, 32px padding. Top: 3D isometric icon (wireframe cube or solid stairs) in #7fee64, 120px square. Title: Goga 24px weight 400, #ddffdc, 16px top margin. Description: Inter 16px weight 400, #8cab87, 8px top margin. No border, no shadow.

**4. Navigation Bar**: Fixed top, full-width, #212525 background, 10px backdrop blur, 1px bottom border #1f2a33. Height 64px, horizontal padding 24px. Left: logo (lime 3D mark + 'Modal' in Goga 20px weight 500, #ddffdc). Center: nav links (Inter 14px weight 500, #ddffdc, 32px gap). Right: 'Login' text link (#859984) + 'Sign Up' lime pill button (#7fee64 bg, #181818 text, 9999px radius, 8px 16px padding).

**5. Section with Eyebrow + Heading + 3-Column Grid**: Full-width #000000 band, 80px vertical padding, max-width 1280px centered. Eyebrow: Inter 12px weight 500, uppercase, +0.6px tracking, #9cbf93. Heading: Goga 42px weight 500, lh 1.05, -0.336px tracking, #ddffdc, 12px below eyebrow. Below: 3-column grid with 20px gap, each cell is a Workload Card as specified above.

## Motion & Transition Philosophy

Modal's motion is expressive but restrained in vocabulary. Primary transition duration is 300ms with ease-out for UI state changes (color, background, border, fill, stroke — all transition together for a unified feel). The timing function cubic-bezier(0.34, 1.56, 0.64, 1) is used sparingly for 'spring' moments on the 3D cube and key illustrations. Long-duration ambient animations (80s) drive the continuous rotation of the hero cube. The system avoids bouncy or playful easings on UI chrome — springs are for the brand visuals, not the buttons. All color transitions should include the full set: color, background-color, border-color, fill, stroke, and text-decoration-color transitioning simultaneously over 300ms ease-out to maintain a single coherent feel.

## The Phosphor Metaphor

Modal's design speaks the visual language of a CRT terminal: a black void canvas, pale-green phosphor type (slightly warm, not pure green-0), and a single status LED (the vivid lime) that signals active state. This is not a coincidence — the platform is for developers, and the aesthetic pays homage to terminal culture without being kitschy. When in doubt about any design decision, ask: 'Would this look right on a high-end oscilloscope display?' The answer should be yes. This rules out: neon effects, glow filters on text, scanline textures, monospace-as-decoration, and any visual that reads as 'hacker movie' rather than 'professional infrastructure tool.'

## Similar Brands

- **Replicate** — Same dark canvas with a single vivid green accent, developer-first code-window imagery, and a rationed-use approach to chromatic color
- **Together AI** — Dark-mode AI infrastructure with a lime/emerald accent, similar generous spacing, and a custom geometric display face for headings
- **Railway** — Dark-by-default dev tool with a single bright accent color, flat surfaces, and hairline borders instead of shadows for depth
- **Vercel** — Dark mode marketing site with generous whitespace, centered hero stacks, and 2-column feature sections with code/visual cards
- **Anyscale** — Developer-focused AI infrastructure with a green-on-dark phosphor aesthetic and 3D illustration accents

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-void-black: #000000;
  --color-ground-iron: #181818;
  --color-carbon-veil: #212525;
  --color-circuit-border: #485346;
  --color-phosphor-blue-black: #1f2a33;
  --color-charcoal-rust: #231c1c;
  --color-lime-pulse: #7fee64;
  --color-phosphor-white: #ddffdc;
  --color-mint-frost: #def0dd;
  --color-sage-60: #8cab87;
  --color-sage-40: #677d64;
  --color-moss-70: #9cbf93;
  --color-moss-80: #aed2a4;
  --color-fern-link: #859984;
  --color-deep-fern: #697368;
  --color-pine-15: #3e4a3c;

  /* Typography — Font Families */
  --font-goga: 'Goga', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-inter-variable: 'Inter Variable', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.33;
  --tracking-caption: 0.6px;
  --text-body-sm: 14px;
  --leading-body-sm: 1.43;
  --tracking-body-sm: -0.364px;
  --text-body: 16px;
  --leading-body: 1.5;
  --tracking-body: -0.352px;
  --text-subheading: 20px;
  --leading-subheading: 1.5;
  --tracking-subheading: -0.36px;
  --text-heading-sm: 24px;
  --leading-heading-sm: 1.3;
  --tracking-heading-sm: -0.312px;
  --text-heading: 30px;
  --leading-heading: 1.2;
  --tracking-heading: -0.36px;
  --text-heading-lg: 42px;
  --leading-heading-lg: 1.05;
  --tracking-heading-lg: -0.336px;
  --text-display: 64px;
  --leading-display: 1;
  --tracking-display: -0.448px;

  /* Typography — Weights */
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
  --spacing-28: 28px;
  --spacing-32: 32px;
  --spacing-36: 36px;
  --spacing-40: 40px;
  --spacing-48: 48px;
  --spacing-56: 56px;
  --spacing-64: 64px;
  --spacing-96: 96px;
  --spacing-128: 128px;
  --spacing-160: 160px;

  /* Layout */
  --page-max-width: 1280px;
  --section-gap: 80px;
  --card-padding: 32px;
  --element-gap: 20px;

  /* Border Radius */
  --radius-md: 4px;
  --radius-lg: 8px;
  --radius-xl: 12px;
  --radius-3xl: 25px;

  /* Named Radii */
  --radius-cards: 8px;
  --radius-icons: 0px;
  --radius-pills: 9999px;
  --radius-inputs: 8px;
  --radius-buttons: 12px;

  /* Shadows */
  --shadow-md: rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.1) 0px 4px 6px -4px;

  /* Surfaces */
  --surface-void: #000000;
  --surface-ground: #181818;
  --surface-carbon: #212525;
  --surface-mint-frost: #def0dd;
  --surface-lime-pulse: #7fee64;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-void-black: #000000;
  --color-ground-iron: #181818;
  --color-carbon-veil: #212525;
  --color-circuit-border: #485346;
  --color-phosphor-blue-black: #1f2a33;
  --color-charcoal-rust: #231c1c;
  --color-lime-pulse: #7fee64;
  --color-phosphor-white: #ddffdc;
  --color-mint-frost: #def0dd;
  --color-sage-60: #8cab87;
  --color-sage-40: #677d64;
  --color-moss-70: #9cbf93;
  --color-moss-80: #aed2a4;
  --color-fern-link: #859984;
  --color-deep-fern: #697368;
  --color-pine-15: #3e4a3c;

  /* Typography */
  --font-goga: 'Goga', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-inter-variable: 'Inter Variable', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.33;
  --tracking-caption: 0.6px;
  --text-body-sm: 14px;
  --leading-body-sm: 1.43;
  --tracking-body-sm: -0.364px;
  --text-body: 16px;
  --leading-body: 1.5;
  --tracking-body: -0.352px;
  --text-subheading: 20px;
  --leading-subheading: 1.5;
  --tracking-subheading: -0.36px;
  --text-heading-sm: 24px;
  --leading-heading-sm: 1.3;
  --tracking-heading-sm: -0.312px;
  --text-heading: 30px;
  --leading-heading: 1.2;
  --tracking-heading: -0.36px;
  --text-heading-lg: 42px;
  --leading-heading-lg: 1.05;
  --tracking-heading-lg: -0.336px;
  --text-display: 64px;
  --leading-display: 1;
  --tracking-display: -0.448px;

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
  --spacing-40: 40px;
  --spacing-48: 48px;
  --spacing-56: 56px;
  --spacing-64: 64px;
  --spacing-96: 96px;
  --spacing-128: 128px;
  --spacing-160: 160px;

  /* Border Radius */
  --radius-md: 4px;
  --radius-lg: 8px;
  --radius-xl: 12px;
  --radius-3xl: 25px;

  /* Shadows */
  --shadow-md: rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.1) 0px 4px 6px -4px;
}
```
