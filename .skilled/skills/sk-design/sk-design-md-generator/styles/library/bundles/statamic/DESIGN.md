# Statamic — Style Reference
> Warm editorial sunset over floating islands

**Theme:** light

Statamic pairs a warm, editorial display serif with a clean geometric sans for a CMS that feels like a publication rather than a dashboard. The visual system lives in a sunlit peach-to-pink gradient world decorated with floating tropical islands — the brand leans into warmth, softness, and a slightly handcrafted sensibility. Color is used sparingly against an off-white canvas: olive-green electric lime as the brand spark, muted lavender for outlined actions, and near-black for the filled primary button. Surfaces are soft with minimal elevation, radii stay modest (8px dominates), and shadows whisper rather than shout. Typography carries most of the personality — a thin serif at 60-96px for headlines with tight tracking, and Lexend in its lighter weights for body and UI text.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Ink | `#191a1b` | `--color-ink` | Dark borders and separators for elevated surfaces and inverted UI. Do not promote it to the primary CTA color |
| Paper White | `#ffffff` | `--color-paper-white` | Page canvas, card surfaces, button text on dark fills, list backgrounds |
| Warm Shell | `#fdf1ef` | `--color-warm-shell` | Hero gradient base, secondary surfaces — the warm cream that gives the whole site its sunset atmosphere |
| Driftwood | `#beb9b3` | `--color-driftwood` | Muted body text, subtle borders, image shadows — warm gray that harmonizes with the peach canvas |
| Smoke | `#5e5a5a` | `--color-smoke` | Nav text, icon strokes, list borders, secondary text |
| Graphite | `#4e5154` | `--color-graphite` | Body text at reduced contrast, fine borders in content blocks |
| Iron | `#3f3f46` | `--color-iron` | Deeper secondary text, fine separator borders |
| Mist | `#cbd5e0` | `--color-mist` | Hairline borders, light dividers between sections and cards |
| Electric Lime | `#d4ff4c` | `--color-electric-lime` | Green accent for outlined action borders, linked labels, and lightweight interactive emphasis. Do not promote it to the primary CTA color |
| Lavender Whisper | `#cbc2ea` | `--color-lavender-whisper` | Outlined action borders, ghost button strokes, soft decorative accents — a desaturated violet that signals interactivity without shouting |
| Lilac Mist | `#d7e5fe` | `--color-lilac-mist` | Decorative pastel wash, soft card accents, illustration tints |
| Blossom | `#f5ddee` | `--color-blossom` | Decorative pastel wash, hero gradient highlight, soft illustration tint |
| Plum Shadow | `#4c305a` | `--color-plum-shadow` | Deep accent in image shadows and illustration depth — gives floating islands their grounded dimensionality |
| Dusk Gradient | `linear-gradient(to right bottom, rgb(51, 65, 85), rgb(25, 26, 27))` | `--color-dusk-gradient` | Gradient endpoint for dark image overlays |
| Aurora Wash | `linear-gradient(233deg, rgba(50, 197, 255, 0.08), rgba(182, 32, 224, 0.08) 51%, rgba(247, 181, 0, 0.08))` | `--color-aurora-wash` | Subtle multi-hue gradient wash on feature sections — used at 0.08 opacity for atmospheric backgrounds |

## Tokens — Typography

### p22-mackinac-pro — Display headlines and editorial accents. Weight 300-400 at 60-96px creates the signature warm, literary feel — the serif whispers rather than commands. Italic variant used for emphasis words in headlines ('actually', 'Statamic'). · `--font-p22-mackinac-pro`
- **Substitute:** Fraunces, Source Serif Pro, or Lora
- **Weights:** 100, 300, 400, 700
- **Sizes:** 20, 24, 30, 60, 80, 96
- **Line height:** 1.0–1.5
- **Letter spacing:** -0.05em at display sizes
- **Role:** Display headlines and editorial accents. Weight 300-400 at 60-96px creates the signature warm, literary feel — the serif whispers rather than commands. Italic variant used for emphasis words in headlines ('actually', 'Statamic').

### Lexend — Primary UI and body typeface. Nav, buttons, body text, card titles, footer. Weight 300 for nav and secondary text keeps the interface light; 500-600 for buttons and labels. The wide weight range lets it carry both quiet metadata and confident CTAs. · `--font-lexend`
- **Substitute:** Inter, DM Sans, or Plus Jakarta Sans
- **Weights:** 300, 400, 500, 600, 700
- **Sizes:** 12, 14, 16, 18, 20, 36
- **Line height:** 1.0–2.0
- **Letter spacing:** -0.025em, 0.05em
- **Role:** Primary UI and body typeface. Nav, buttons, body text, card titles, footer. Weight 300 for nav and secondary text keeps the interface light; 500-600 for buttons and labels. The wide weight range lets it carry both quiet metadata and confident CTAs.

### code-saver — Monospace for code blocks, file tree, technical content, input fields. Weight 700 for syntax emphasis, 300 for ambient code display. · `--font-code-saver`
- **Substitute:** JetBrains Mono, Fira Code, or IBM Plex Mono
- **Weights:** 300, 700
- **Sizes:** 12, 14, 16, 20
- **Line height:** 1.33–2.0
- **Letter spacing:** normal
- **Role:** Monospace for code blocks, file tree, technical content, input fields. Weight 700 for syntax emphasis, 300 for ambient code display.

### Lore — Icon font — single weight at 14px for UI iconography · `--font-lore`
- **Substitute:** Phosphor Icons or Lucide
- **Weights:** 300
- **Sizes:** 14
- **Line height:** 1.43
- **Letter spacing:** normal
- **Role:** Icon font — single weight at 14px for UI iconography

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 12px | 1.5 | 0.05px | `--text-caption` |
| body-sm | 14px | 1.43 | — | `--text-body-sm` |
| body | 16px | 1.5 | — | `--text-body` |
| subheading | 20px | 1.4 | -0.025px | `--text-subheading` |
| heading | 36px | 1.25 | -0.025px | `--text-heading` |
| display | 60px | 1.2 | -0.05px | `--text-display` |
| display-lg | 96px | 1 | -0.05px | `--text-display-lg` |

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
| 96 | 96px | `--spacing-96` |
| 128 | 128px | `--spacing-128` |
| 208 | 208px | `--spacing-208` |

### Border Radius

| Element | Value |
|---------|-------|
| cards | 8px |
| pills | 9999px |
| images | 12px |
| buttons | 8px |
| largeCards | 16px |

### Shadows

| Name | Value | Token |
|------|-------|-------|
| sm | `rgba(0, 0, 0, 0.05) 0px 2px 6px -16px, rgba(0, 0, 0, 0.25...` | `--shadow-sm` |
| subtle | `rgba(0, 0, 0, 0.15) 0px 2px 3px -2px` | `--shadow-subtle` |
| subtle-2 | `rgba(94, 90, 90, 0.1) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1)...` | `--shadow-subtle-2` |
| subtle-3 | `rgba(0, 0, 0, 0.05) 0px 1px 2px 0px` | `--shadow-subtle-3` |
| sm-2 | `rgba(0, 0, 0, 0.07) 0px 2px 8px 0px, rgba(0, 0, 0, 0.05) ...` | `--shadow-sm-2` |
| xl | `rgb(76, 48, 90) 0px 11px 37px -18px` | `--shadow-xl` |
| subtle-4 | `rgb(113, 113, 122) 0px 0px 0px 1px` | `--shadow-subtle-4` |
| xl-2 | `rgb(190, 185, 179) 0px 24px 64px -12px` | `--shadow-xl-2` |
| subtle-5 | `rgba(94, 90, 90, 0.1) 0px 0px 0px 1px, rgb(190, 185, 179)...` | `--shadow-subtle-5` |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 64px
- **Card padding:** 16px
- **Element gap:** 16px

## Components

### Filled Primary Button
**Role:** Primary call-to-action for conversion (Get Pro Now)

Background #191a1b, text #d4ff4c (Electric Lime), Lexend 16px weight 500, 8px radius, 12px 24px padding, subtle shadow (rgba(0,0,0,0.05) 0px 1px 2px). The dark fill with lime text creates the brand's signature contrast point — the only place this color combo appears, making it unmistakable as the primary action.

### Ghost Outlined Button
**Role:** Secondary action (Try the Demo)

Transparent background, 1.5px border in #cbc2ea (Lavender Whisper), text #191a1b, Lexend 16px weight 500, 8px radius, 12px 24px padding. The muted lavender border signals interactivity without competing with the filled primary.

### Navigation Bar
**Role:** Top-level site navigation

Transparent over hero gradient, white on scroll. Lexend 14px weight 400, #191a1b text. Logo: Statamic S-mark in #d4ff4c lime block. Nav items with 16px gap, dropdown indicators as carets. Right side: user icon in circle. Sticky behavior expected.

### Display Headline
**Role:** Hero and section headlines

p22-mackinac-pro weight 300-400, 60-96px, line-height 1.0-1.2, letter-spacing -0.05em, color #191a1b. Italic variant for emphasis words within the line. The thin weight at large size with tight tracking is the signature editorial choice.

### Hero Section
**Role:** Full-width above-the-fold area

Background: linear gradient from #fdf1ef (top) through peach tones to soft pink. Floating island illustrations (palm trees, toucan, clouds) positioned at left and right edges, partially clipped. Centered text block with max-width ~800px. Two CTA buttons side by side, then a small developer note link below.

### Product UI Card
**Role:** Embedded screenshot/mockup of the CMS interface

Large card with 16px radius, white background, subtle dual shadow (rgba(94,90,90,0.1) 0px 0px 0px 1px + rgba(0,0,0,0.1) 0px 16px 40px -8px). Contains a simulated dark toolbar (#191a1b) with tab-like elements, white content area with sidebar + editor layout. The 1px border + large diffuse shadow is the signature card elevation.

### Code/File Editor Mockup
**Role:** Technical demonstration block

Split panel: left shows file tree (folders, .md files) in #fdf1ef tinted background, right shows YAML/code content with syntax highlighting (blue #0444ac keys, pink #a44185 values, dark navy #002339 text). Code-saver monospace 14px. 8px radius outer container, subtle shadow.

### Feature Section Layout
**Role:** Content sections between hero and footer

Centered headline at 36-60px display, max-width text block, then visual element (screenshot/code mockup) at full container width. 64px section gap. Alternating between white and warm-shell backgrounds.

### Badge/Tag
**Role:** Status indicators, topic labels

Small pill-shaped labels, 9999px radius, Lexend 12px weight 500, 4px 12px padding. Background varies by topic (light tints of lavender, pink, blue). Used in product UI mockup sidebar.

### Icon Circle
**Role:** Nav avatar, decorative circular elements

Round container, 9999px radius, 1px border in #191a1b or fill in #d4ff4c. Contains Lore icon font glyphs at 14px. 32-40px diameter.

### Ghost Link
**Role:** Inline links in body text and developer notes

Lexend 16px weight 400, #191a1b text, underline on hover only. No background or border. Minimal — links blend into prose until interaction.

### Input Field
**Role:** Form inputs in product UI

White background, 1px border in #cbd5e0 (Mist), 8px radius, 8px 12px padding. Code-saver monospace 14px for technical inputs. Focus ring: lavender #cbc2ea at 2px.

## Do's and Don'ts

### Do
- Use p22-mackinac-pro weight 300-400 at 60-96px for display headlines with -0.05em letter-spacing
- Pair the filled dark button (#191a1b bg, #d4ff4c text, 8px radius) as the single primary action on any page
- Use Lavender Whisper (#cbc2ea) for outlined/ghost action borders — never as a filled background
- Maintain 16px element gaps and 64px section gaps as the base rhythm
- Let the warm-shell (#fdf1ef) background appear in at least one section per page to establish atmosphere
- Use 8px radius for buttons and small cards, 12px for images, 16px for large content cards, 9999px for pills and icon circles
- Apply the dual shadow (1px border + 40px diffuse) to large elevated content cards

### Don't
- Don't use weight 600+ for display headlines — the signature is whisper-thin serif at large size
- Don't place #d4ff4c lime on a light background — it loses contrast; reserve it for dark fills or small accent marks
- Don't use heavy drop shadows on buttons — the system uses barely-there 1-2px elevation
- Don't use #cbc2ea lavender as a background fill — it's an outline color only
- Don't break the serif/sans pairing — don't set body text in p22-mackinac-pro or headlines in Lexend
- Don't add more than one vivid color to any single surface — the palette is disciplined
- Don't use sharp 0px or 4px radii on cards — the system is consistently 8px+

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Canvas | `#ffffff` | Base page background |
| 1 | Warm Shell | `#fdf1ef` | Hero gradient base, warm section backgrounds |
| 2 | Card | `#ffffff` | Product UI mockup cards, elevated content blocks with subtle 1px border + 40px shadow |
| 3 | Dark Surface | `#191a1b` | Filled primary button, dark code editor panels |

## Elevation

- **Product UI Card / Large Content Card:** `rgba(94, 90, 90, 0.1) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 16px 40px -8px`
- **Image with elevation:** `rgba(0, 0, 0, 0.05) 0px 2px 6px -16px, rgba(0, 0, 0, 0.25) 0px 7px 10px -4px`
- **Filled Button:** `rgba(0, 0, 0, 0.05) 0px 1px 2px 0px`
- **Outlined/Interactive Element:** `rgba(0, 0, 0, 0.15) 0px 2px 3px -2px`

## Imagery

The site uses a distinctive illustrated world of floating tropical islands with palm trees, toucans, and clouds set against warm sunset gradients. These are not decorative afterthoughts — they're a signature brand element positioned at hero edges as partial silhouettes. Product visuals are large, detailed UI mockups (CMS control panel, code editor) shown at full container width with generous shadows, letting the interface speak for itself. Photography does not appear; the visual language is entirely illustration + product UI. Icons use the custom Lore font at weight 300. Imagery density is moderate — illustrations frame content rather than dominate it.

## Layout

Max-width 1200px centered container with generous outer padding. Hero is full-bleed with a warm gradient background, centered headline stack, and floating island illustrations anchored to the left and right edges. Below the hero, sections alternate between white and warm-shell (#fdf1ef) backgrounds with 64px vertical gaps. Content arrangement is primarily centered/stacked with full-width visual elements (product screenshots, code mockups) breaking up the text. The code/file demo section uses a two-panel split (file tree left, code right). Navigation is a clean top bar with centered logo, left-aligned nav items, and right-aligned user icon. The overall rhythm is spacious and editorial — breathing room between sections, single-column text blocks, and one large visual per section.

## Agent Prompt Guide

**Quick Color Reference**
- text: #191a1b (Ink)
- background: #ffffff (Paper White)
- hero/warm surface: #fdf1ef (Warm Shell)
- border: #cbd5e0 (Mist) or #beb9b3 (Driftwood)
- accent: #d4ff4c (Electric Lime) — logo, CTA text on dark
- primary action: #cbc2ea (outlined action border)

**Example Component Prompts**

1. **Hero Section**: Full-bleed background with gradient from #fdf1ef (top) to soft pink (bottom). Centered headline at 80px p22-mackinac-pro weight 300, color #191a1b, letter-spacing -4px. Italic emphasis on one word. Subtext at 18px Lexend weight 400, #191a1b. Two buttons centered: filled dark button (12px 24px padding, 8px radius, #191a1b bg, #d4ff4c text, Lexend 16px weight 500) and ghost outlined button (12px 24px padding, 1.5px border #cbc2ea, 8px radius, #191a1b text). Floating island illustrations at left and right edges, partially clipped.

2. **Display Headline Block**: p22-mackinac-pro weight 300, 60px, line-height 1.2, letter-spacing -3px, color #191a1b. Max-width 800px centered. Second line can use weight 400 italic for emphasis.

3. **Product UI Card**: White card, 16px radius, dual shadow (1px border rgba(94,90,90,0.1) + 40px diffuse rgba(0,0,0,0.1)). Contains a dark toolbar (#191a1b) with Lexend 12px weight 500 white text, and a white content body with sidebar + editor layout using 8px 12px padding in content cells.

4. **Code/Editor Mockup**: Two-panel split in a card with 8px radius. Left panel: #fdf1ef background with file tree (folder icons + .md filenames in code-saver 14px weight 400). Right panel: white background with YAML code, code-saver 14px, syntax colors — keys in #0444ac, values in #a44185, structure in #002339. Subtle outer shadow.

5. **Section Divider**: 64px vertical gap between sections. Alternate backgrounds between #ffffff and #fdf1ef. No visible divider line — the background change creates separation.

## Similar Brands

- **Linear** — Same discipline of dark filled primary action against a light canvas, with minimal color and strong typographic personality
- **Vercel** — Shared approach of generous whitespace, centered content stacks, and letting product UI screenshots serve as the primary visual content
- **Stripe** — Similar warm gradient hero treatments and serif-meets-sans headline pairing for editorial warmth
- **Sanity** — Same CMS-tool positioning with large product mockups, developer-focused code blocks, and restrained accent color
- **Craft CMS** — Shared editorial sensibility with serif display type, warm backgrounds, and illustration-driven hero sections

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-ink: #191a1b;
  --color-paper-white: #ffffff;
  --color-warm-shell: #fdf1ef;
  --color-driftwood: #beb9b3;
  --color-smoke: #5e5a5a;
  --color-graphite: #4e5154;
  --color-iron: #3f3f46;
  --color-mist: #cbd5e0;
  --color-electric-lime: #d4ff4c;
  --color-lavender-whisper: #cbc2ea;
  --color-lilac-mist: #d7e5fe;
  --color-blossom: #f5ddee;
  --color-plum-shadow: #4c305a;
  --color-dusk-gradient: #334155;
  --gradient-dusk-gradient: linear-gradient(to right bottom, rgb(51, 65, 85), rgb(25, 26, 27));
  --color-aurora-wash: #32c5ff;
  --gradient-aurora-wash: linear-gradient(233deg, rgba(50, 197, 255, 0.08), rgba(182, 32, 224, 0.08) 51%, rgba(247, 181, 0, 0.08));

  /* Typography — Font Families */
  --font-p22-mackinac-pro: 'p22-mackinac-pro', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-lexend: 'Lexend', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-code-saver: 'code-saver', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  --font-lore: 'Lore', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.5;
  --tracking-caption: 0.05px;
  --text-body-sm: 14px;
  --leading-body-sm: 1.43;
  --text-body: 16px;
  --leading-body: 1.5;
  --text-subheading: 20px;
  --leading-subheading: 1.4;
  --tracking-subheading: -0.025px;
  --text-heading: 36px;
  --leading-heading: 1.25;
  --tracking-heading: -0.025px;
  --text-display: 60px;
  --leading-display: 1.2;
  --tracking-display: -0.05px;
  --text-display-lg: 96px;
  --leading-display-lg: 1;
  --tracking-display-lg: -0.05px;

  /* Typography — Weights */
  --font-weight-thin: 100;
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
  --spacing-96: 96px;
  --spacing-128: 128px;
  --spacing-208: 208px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 64px;
  --card-padding: 16px;
  --element-gap: 16px;

  /* Border Radius */
  --radius-lg: 8px;
  --radius-xl: 12px;
  --radius-2xl: 16px;
  --radius-full: 9999px;

  /* Named Radii */
  --radius-cards: 8px;
  --radius-pills: 9999px;
  --radius-images: 12px;
  --radius-buttons: 8px;
  --radius-largecards: 16px;

  /* Shadows */
  --shadow-sm: rgba(0, 0, 0, 0.05) 0px 2px 6px -16px, rgba(0, 0, 0, 0.25) 0px 7px 10px -4px;
  --shadow-subtle: rgba(0, 0, 0, 0.15) 0px 2px 3px -2px;
  --shadow-subtle-2: rgba(94, 90, 90, 0.1) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 16px 40px -8px;
  --shadow-subtle-3: rgba(0, 0, 0, 0.05) 0px 1px 2px 0px;
  --shadow-sm-2: rgba(0, 0, 0, 0.07) 0px 2px 8px 0px, rgba(0, 0, 0, 0.05) 0px 3px 5px -4px;
  --shadow-xl: rgb(76, 48, 90) 0px 11px 37px -18px;
  --shadow-subtle-4: rgb(113, 113, 122) 0px 0px 0px 1px;
  --shadow-xl-2: rgb(190, 185, 179) 0px 24px 64px -12px;
  --shadow-subtle-5: rgba(94, 90, 90, 0.1) 0px 0px 0px 1px, rgb(190, 185, 179) 0px 24px 64px -12px;

  /* Surfaces */
  --surface-canvas: #ffffff;
  --surface-warm-shell: #fdf1ef;
  --surface-card: #ffffff;
  --surface-dark-surface: #191a1b;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-ink: #191a1b;
  --color-paper-white: #ffffff;
  --color-warm-shell: #fdf1ef;
  --color-driftwood: #beb9b3;
  --color-smoke: #5e5a5a;
  --color-graphite: #4e5154;
  --color-iron: #3f3f46;
  --color-mist: #cbd5e0;
  --color-electric-lime: #d4ff4c;
  --color-lavender-whisper: #cbc2ea;
  --color-lilac-mist: #d7e5fe;
  --color-blossom: #f5ddee;
  --color-plum-shadow: #4c305a;
  --color-dusk-gradient: #334155;
  --color-aurora-wash: #32c5ff;

  /* Typography */
  --font-p22-mackinac-pro: 'p22-mackinac-pro', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-lexend: 'Lexend', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-code-saver: 'code-saver', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  --font-lore: 'Lore', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.5;
  --tracking-caption: 0.05px;
  --text-body-sm: 14px;
  --leading-body-sm: 1.43;
  --text-body: 16px;
  --leading-body: 1.5;
  --text-subheading: 20px;
  --leading-subheading: 1.4;
  --tracking-subheading: -0.025px;
  --text-heading: 36px;
  --leading-heading: 1.25;
  --tracking-heading: -0.025px;
  --text-display: 60px;
  --leading-display: 1.2;
  --tracking-display: -0.05px;
  --text-display-lg: 96px;
  --leading-display-lg: 1;
  --tracking-display-lg: -0.05px;

  /* Spacing */
  --spacing-8: 8px;
  --spacing-16: 16px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-40: 40px;
  --spacing-48: 48px;
  --spacing-64: 64px;
  --spacing-96: 96px;
  --spacing-128: 128px;
  --spacing-208: 208px;

  /* Border Radius */
  --radius-lg: 8px;
  --radius-xl: 12px;
  --radius-2xl: 16px;
  --radius-full: 9999px;

  /* Shadows */
  --shadow-sm: rgba(0, 0, 0, 0.05) 0px 2px 6px -16px, rgba(0, 0, 0, 0.25) 0px 7px 10px -4px;
  --shadow-subtle: rgba(0, 0, 0, 0.15) 0px 2px 3px -2px;
  --shadow-subtle-2: rgba(94, 90, 90, 0.1) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 16px 40px -8px;
  --shadow-subtle-3: rgba(0, 0, 0, 0.05) 0px 1px 2px 0px;
  --shadow-sm-2: rgba(0, 0, 0, 0.07) 0px 2px 8px 0px, rgba(0, 0, 0, 0.05) 0px 3px 5px -4px;
  --shadow-xl: rgb(76, 48, 90) 0px 11px 37px -18px;
  --shadow-subtle-4: rgb(113, 113, 122) 0px 0px 0px 1px;
  --shadow-xl-2: rgb(190, 185, 179) 0px 24px 64px -12px;
  --shadow-subtle-5: rgba(94, 90, 90, 0.1) 0px 0px 0px 1px, rgb(190, 185, 179) 0px 24px 64px -12px;
}
```
