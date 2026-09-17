# Stark — Style Reference
> midnight lecture hall with yellow highlighter

**Theme:** light

Stark operates as a confident accessibility-infrastructure brand sitting on a dual-surface canvas: a deep midnight-navy hero that crashes into a warm cream secondary field, linked by a vivid violet primary action and a mustard-yellow highlighter that reads like a teacher's marking pen. The type system is anchored by ArminGrotesk at its heaviest possible weight (900) for hero display — the 110px headline is not a statement, it is a wall — then steps down through 56/48/28/24/20/16/14 with tight negative tracking (-0.02em) that pulls large letters into a single sculpted block. Yellow is not decoration; it marks emphasis inside running copy (the diagonal-split gradient) and signals one specific action. Violet is the chromatic engine: CTA fills, card borders, icon accents, active states. Everything else stays in a narrow achromatic corridor of #000, #fff, and #e5e7eb hairlines, so the two chromatic colors always read with maximum signal.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Midnight Navy | `#10284b` | `--color-midnight-navy` | Hero background, primary headings, footer surface — the dominant brand color establishes authority and anchors the dark-to-light page split. Used as a background field for the above-the-fold section and as body-text color on the cream secondary surface |
| Stark Violet | `#381fd1` | `--color-stark-violet` | Primary action fills (Get started, Sign up, Request demo), card border accents, active nav state, decorative icon strokes, and inline emphasis text. The vivid violet against midnight navy creates a switched-on, electric feel without aggression |
| Highlighter Yellow | `#fedb63` | `--color-highlighter-yellow` | Diagonal text-highlight gradient fill, one specific secondary CTA, and illustration accent. Yellow never decorates broadly — it marks, underlines, and punctuates specific words within dark-on-light headlines |
| Lilac Tint | `#e5e0ff` | `--color-lilac-tint` | Soft button surface variant, gentle tinted card backgrounds. A desaturated wash of the violet brand that softens interactive elements without competing with the primary action |
| Mint Splash | `#99d6cc` | `--color-mint-splash` | Decorative illustration accent in feature cards and dashboard widgets. Used sparingly in flat geometric shapes within artwork, not in core UI controls |
| Page Canvas | `#faf5ff` | `--color-page-canvas` | Lightly purple-tinted near-white page background. The faint violet cast unifies the cream and white surfaces under one chromatic family |
| Cream Field | `#f6f6eb` | `--color-cream-field` | Secondary section surface and body-text color on the dark hero. The warm greenish-cream provides a relaxed counterpoint to the midnight navy and is the dominant body-text/link color on the dark section |
| Carbon | `#000000` | `--color-carbon` | Body text on light surfaces, icon strokes, and high-contrast elements. Not used as a background — the system prefers the midnight navy for darkness |
| Pure White | `#ffffff` | `--color-pure-white` | Text on dark hero, card surfaces, nav backgrounds, product screenshot frames. The bright surface that holds product imagery and dashboard content |
| Hairline Gray | `#e5e7eb` | `--color-hairline-gray` | Universal border color for cards, inputs, dividers, link underlines, and structural separators. The single achromatic border workhorse |

## Tokens — Typography

### ArminGrotesk — The single custom typeface carries the entire brand voice. Weight 900 is the hero display weapon (110px headline) — used at maximum volume for the opening statement. Weight 600 handles section headings and subheadings (24-48px). Weight 500 is the button and label workhorse. Weight 400 is body text. The geometric grotesque construction gives a contemporary, slightly technical authority. · `--font-armingrotesk`
- **Substitute:** Space Grotesk or Inter at equivalent weights
- **Weights:** 400, 500, 600, 900
- **Sizes:** 14, 16, 20, 24, 28, 48, 56, 110
- **Line height:** 1.10, 1.43, 1.50, 1.70
- **Letter spacing:** -0.0200em at 110px, -0.0100em at 48-56px, 0.0200em at 16-20px, 0.0800em at 14px uppercase labels
- **Role:** The single custom typeface carries the entire brand voice. Weight 900 is the hero display weapon (110px headline) — used at maximum volume for the opening statement. Weight 600 handles section headings and subheadings (24-48px). Weight 500 is the button and label workhorse. Weight 400 is body text. The geometric grotesque construction gives a contemporary, slightly technical authority.

### RobotoMono — All-caps eyebrow labels and section markers (e.g., 'EXPLORE THE STARK PLATFORM', 'SPEED UP DESIGN & DEV'). The monospaced mono with wide tracking creates a distinct utilitarian signal that sits above the display heading and below the nav — a consistent navigational breadcrumb layer. · `--font-robotomono`
- **Substitute:** JetBrains Mono Bold or IBM Plex Mono Bold
- **Weights:** 700
- **Sizes:** 13, 16
- **Line height:** 1.40
- **Letter spacing:** 0.0800em
- **Role:** All-caps eyebrow labels and section markers (e.g., 'EXPLORE THE STARK PLATFORM', 'SPEED UP DESIGN & DEV'). The monospaced mono with wide tracking creates a distinct utilitarian signal that sits above the display heading and below the nav — a consistent navigational breadcrumb layer.

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 14px | 1.43 | -0.28px | `--text-caption` |
| body-sm | 16px | 1.5 | -0.16px | `--text-body-sm` |
| body | 20px | 1.7 | 0.4px | `--text-body` |
| subheading | 24px | 1.5 | — | `--text-subheading` |
| heading-sm | 28px | 1.5 | — | `--text-heading-sm` |
| heading | 48px | 1.1 | -0.48px | `--text-heading` |
| heading-lg | 56px | 1.1 | -0.56px | `--text-heading-lg` |
| display | 110px | 1.1 | -2.2px | `--text-display` |

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
| 64 | 64px | `--spacing-64` |
| 80 | 80px | `--spacing-80` |
| 144 | 144px | `--spacing-144` |

### Border Radius

| Element | Value |
|---------|-------|
| nav | 6px |
| cards | 12px |
| pills | 20px |
| buttons | 6px |
| feature-cards | 40px |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 56px
- **Card padding:** 24px
- **Element gap:** 8px

## Components

### Violet Primary Button
**Role:** Main conversion action

Filled button with #381fd1 background, white text, ArminGrotesk 500 at 16px, 6px border-radius, 8px vertical × 24px horizontal padding. Used for 'Sign up for free', 'Get started for free'. The vivid violet against both midnight navy and cream fields makes the action immediately findable.

### Yellow Secondary Button
**Role:** Alternate call-to-action on dark hero

Filled button with #fedb63 background, midnight navy text, ArminGrotesk 500 at 16px, 6px border-radius, same padding as primary. Appears once on the dark hero to provide a second action path that doesn't compete with the main violet CTA.

### Ghost Outline Button
**Role:** Tertiary action in navigation

Transparent fill, 1px white border, white text, 6px border-radius, used for 'Request Demo' in the nav. Minimal weight that recedes behind the primary yellow or violet action.

### Pill Label
**Role:** Category and feature eyebrow tags

Small uppercase tag with ArminGrotesk 600 or RobotoMono 700 at 13-14px, 0.08em tracking. 20px border-radius for fully rounded pill shape. Violet text on light, white text on dark. Used above feature card titles and on the 'Team Project' avatar-group label.

### Hero Stat Card
**Role:** Animated metric callout on hero

Compact card floating over the midnight hero, showing a large number (e.g., '120', '641') in white with a label below. Contains a small icon (lightning bolt) and sits with partial transparency over the dotted chart pattern.

### Status Legend Card
**Role:** Right-side stack on hero

Three vertically stacked rows with colored dot indicators (violet, violet, teal) and labels: Violations, Potential Violations, Passed Checks. Semi-transparent dark background with white text, 8px padding between rows.

### Product Screenshot Frame
**Role:** Desktop and mobile app previews

White card with subtle shadow, housing actual product UI. Desktop frames are wide rectangles with 12px radius; mobile frame is a phone-shaped rounded rectangle. Positioned with intentional overlap to create depth.

### Feature Card with Illustration
**Role:** Four-column feature grid

Each card contains: an isometric/geometric flat illustration (teal, yellow, violet, navy palette) at top, a small uppercase violet label, a bold navy heading at 24px, and body text at 16px. 40px border-radius, generous internal padding, no visible border or shadow — relies on the illustration as visual anchor.

### Navigation Bar
**Role:** Top-level site navigation

Horizontal bar on midnight navy background. Left: logo (circular leaf icon). Center: nav items in white uppercase with dropdown carets. Right: 'LOG IN' text link and outlined 'Request Demo' button. Sits over the dark hero without separate background fill.

### Highlighted Text Run
**Role:** Inline emphasis within headings

Specific words within a headline get a diagonal yellow highlighter effect via the linear-gradient(to right bottom, transparent 50%, #fedb63 50%) technique. Creates the impression of a marker pen swipe. Also available in violet variant for secondary emphasis.

### Avatar Group + Label
**Role:** Social proof element

Stack of 3-4 circular avatars (overlapping) followed by a pill-shaped label reading 'Team Project' in violet. Sits inline with hero copy as a trust signal.

### Decorative Dot Pattern
**Role:** Hero background texture

Grid of small dots and vertical bar shapes in lighter purple/lilac tones, scattered across the bottom of the dark hero. Creates data-visualization atmosphere without literal chart content.

## Do's and Don'ts

### Do
- Use ArminGrotesk weight 900 at 110px with -2.2px letter-spacing for the primary hero headline — this is the signature wall-of-text moment.
- Apply the diagonal yellow highlighter gradient (transparent 50% → #fedb63 50%) to one or two words inside a dark-on-light headline to create inline emphasis.
- Set primary action buttons to #381fd1 fill with white text, 6px radius, and 8px×24px padding. Never use the midnight navy as a button fill.
- Use RobotoMono 700 at 13px with 0.08em tracking for all uppercase eyebrow labels above section headings.
- Alternate between midnight-navy hero sections and cream (#f6f6eb) body sections to maintain the dark-to-light page split.
- Set the page background to #faf5ff (not pure white) to carry the subtle violet cast across all light surfaces.
- Use #e5e7eb hairline borders at 1px for all card edges, input fields, and structural dividers — the system relies on lines, not shadows.

### Don't
- Do not use weight 400 or 500 for the hero display headline — the 900 weight at 110px is the brand's signature and must be deployed at maximum volume.
- Do not apply the yellow highlighter gradient to more than 2-3 words in a single headline; it dilutes the marking-pen effect.
- Do not use shadows for cards on the cream or light purple surfaces — the system prefers flat surfaces with hairline borders.
- Do not introduce a second brand-violet shade; #381fd1 is the single chromatic action color and must remain uncontested.
- Do not set body text below 16px or use letter-spacing wider than -0.01em at display sizes — the tight tracking is essential to the geometric grotesque feel.
- Do not place CTA buttons on the midnight-navy hero without sufficient contrast padding or a distinctive fill — the violet and yellow must be the only bright spots on the dark field.
- Do not use the cream (#f6f6eb) as a background for the hero — it is exclusively a secondary-section surface that appears after the dark fold.

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Hero Field | `#10284b` | Full-bleed dark navy above the fold, with decorative dot/bar chart pattern in lighter purple |
| 1 | Page Canvas | `#faf5ff` | Primary light background for the body of the page, faintly violet-tinted |
| 2 | Cream Section | `#f6f6eb` | Alternating warm-cream band that provides visual contrast and houses feature sections |
| 3 | Card Surface | `#ffffff` | Elevated white cards for product screenshots, stat displays, and content blocks |

## Elevation

- **Product Screenshot Frame:** `0 20px 60px rgba(16, 40, 75, 0.15)`
- **Hero Stat Card:** `0 8px 32px rgba(0, 0, 0, 0.2)`

## Imagery

The visual language is split between two modes. On the dark hero, the imagery is abstract: a field of dots and vertical bars in lighter lilac/purple that suggests a data-visualization chart without committing to literal content. On the light sections, the imagery is functional: real product screenshots (desktop dashboard with charts, a detailed scan-results panel, and a mobile app showing project lists) float in white frames with subtle shadows. Feature cards use flat, isometric-style geometric illustrations built from simple shapes (rectangles, circles, arrows, document icons) in a controlled palette of teal, yellow, violet, and midnight navy. No photography of people or environments appears — the product UI and abstract data patterns are the entire visual vocabulary. Iconography is minimal: simple line icons in the stat cards and feature illustrations, with stroke weight proportional to their container size.

## Layout

The page follows a dark-to-light vertical split. The hero is a full-bleed midnight-navy section with centered copy (headline at 110px, body text below, single yellow CTA), flanked by floating stat cards and avatar groups positioned asymmetrically. Below the fold, the layout transitions to a cream (#f6f6eb) band containing overlapping product screenshots (desktop, detail, mobile) arranged in a z-composition with intentional overlap. Feature sections use a max-width 1200px centered container with 4-column card grids on desktop. Each section begins with a centered uppercase eyebrow label, a large two-line headline (with yellow-highlighted phrase), and optional subtext. The rhythm alternates between tight, information-dense product-screenshot sections and spacious 4-column feature grids with 56px vertical gaps. Navigation is a flat top bar over the dark hero with no sticky behavior or shadow.

## Agent Prompt Guide

**Quick Color Reference**
- Text (light surfaces): #000000
- Text (dark hero): #ffffff
- Page background: #faf5ff
- Cream section: #f6f6eb
- Border: #e5e7eb
- primary action: #381fd1 (filled action)
- Highlighter accent: #fedb63

**3 Example Component Prompts**

1. *Hero Headline with Yellow Highlight*: Create a hero section on #10284b background. Display headline 'Digital accessibility compliance on autopilot' in ArminGrotesk weight 900 at 110px, color #ffffff, letter-spacing -2.2px, line-height 1.10. Apply the word 'autopilot' with a diagonal yellow highlighter using background: linear-gradient(to right bottom, transparent 50%, #fedb63 50%). Below: body text in ArminGrotesk 400 at 20px, color #f6f6eb, max-width 600px centered.

2. *Violet Primary CTA Button*: Create a filled button with #381fd1 background, white text in ArminGrotesk 500 at 16px, 6px border-radius, 8px padding-top, 8px padding-bottom, 24px padding-left, 24px padding-right, letter-spacing 0.32px. No border, no shadow. Label: 'Get started for free'.

3. *Feature Card Grid Item*: Create a card on #faf5ff background with 40px border-radius, 24px padding. Top: flat geometric illustration using #99d6cc, #fedb63, #381fd1, and #10284b. Below illustration: uppercase label in RobotoMono 700 at 13px, color #381fd1, letter-spacing 1.04px. Then: heading in ArminGrotesk 600 at 24px, color #10284b. Then: body text in ArminGrotesk 400 at 16px, color #000000, line-height 1.50.

## Gradient System

The gradient vocabulary is minimal and purposeful: two diagonal split-gradients that create the highlighter-pen effect under text. The yellow variant (transparent → #fedb63) is the primary emphasis tool, used on words inside headlines on the cream/light sections. The violet variant (transparent → #381fd1) is the secondary emphasis tool for less critical highlights. Both use the same 50%/50% diagonal split via 'to right bottom' or 'to left top' direction. No radial gradients, no multi-stop brand gradients, no decorative mesh — the gradient system is a single-purpose marking tool.

## Color Role Strategy

The palette enforces a strict 3-tier hierarchy. Tier 1 (Midnight Navy #10284b) is the structural foundation — hero background, all headings on light surfaces, and the brand's gravitational center. Tier 2 (Stark Violet #381fd1) is the interactive engine — every clickable primary action, every card border accent, every active state. Tier 3 (Highlighter Yellow #fedb63) is the emphasis marker — one word at a time, never decorative. Everything else is achromatic or near-achromatic supporting cast. This hierarchy means a user scanning the page sees: dark structure → violet actions → yellow marks → gray text. Violation of this order (e.g., yellow body text, violet headings) breaks the reading rhythm.

## Similar Brands

- **Linear** — Same geometric grotesque display typography at maximum weight for hero headlines, single vivid accent color, and clean hairline-border card aesthetic on near-white backgrounds
- **Notion** — Similar dark-to-light page split with full-bleed colored hero section transitioning to white/cream product content areas, plus confident oversized headline scale
- **Pitch** — Shared approach of vivid chromatic CTA button as the single bright interactive element against neutral surfaces, with display-typeface hero at extreme weight and size
- **Loom** — Similar product-screenshot-on-light-canvas presentation with floating overlapping frames, uppercase eyebrow labels above section headings, and high-contrast dark hero opening

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-midnight-navy: #10284b;
  --color-stark-violet: #381fd1;
  --color-highlighter-yellow: #fedb63;
  --color-lilac-tint: #e5e0ff;
  --color-mint-splash: #99d6cc;
  --color-page-canvas: #faf5ff;
  --color-cream-field: #f6f6eb;
  --color-carbon: #000000;
  --color-pure-white: #ffffff;
  --color-hairline-gray: #e5e7eb;

  /* Typography — Font Families */
  --font-armingrotesk: 'ArminGrotesk', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-robotomono: 'RobotoMono', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;

  /* Typography — Scale */
  --text-caption: 14px;
  --leading-caption: 1.43;
  --tracking-caption: -0.28px;
  --text-body-sm: 16px;
  --leading-body-sm: 1.5;
  --tracking-body-sm: -0.16px;
  --text-body: 20px;
  --leading-body: 1.7;
  --tracking-body: 0.4px;
  --text-subheading: 24px;
  --leading-subheading: 1.5;
  --text-heading-sm: 28px;
  --leading-heading-sm: 1.5;
  --text-heading: 48px;
  --leading-heading: 1.1;
  --tracking-heading: -0.48px;
  --text-heading-lg: 56px;
  --leading-heading-lg: 1.1;
  --tracking-heading-lg: -0.56px;
  --text-display: 110px;
  --leading-display: 1.1;
  --tracking-display: -2.2px;

  /* Typography — Weights */
  --font-weight-regular: 400;
  --font-weight-medium: 500;
  --font-weight-semibold: 600;
  --font-weight-bold: 700;
  --font-weight-black: 900;

  /* Spacing */
  --spacing-unit: 8px;
  --spacing-8: 8px;
  --spacing-16: 16px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-40: 40px;
  --spacing-48: 48px;
  --spacing-56: 56px;
  --spacing-64: 64px;
  --spacing-80: 80px;
  --spacing-144: 144px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 56px;
  --card-padding: 24px;
  --element-gap: 8px;

  /* Border Radius */
  --radius-md: 6px;
  --radius-xl: 12px;
  --radius-2xl: 20px;
  --radius-3xl: 40px;

  /* Named Radii */
  --radius-nav: 6px;
  --radius-cards: 12px;
  --radius-pills: 20px;
  --radius-buttons: 6px;
  --radius-feature-cards: 40px;

  /* Surfaces */
  --surface-hero-field: #10284b;
  --surface-page-canvas: #faf5ff;
  --surface-cream-section: #f6f6eb;
  --surface-card-surface: #ffffff;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-midnight-navy: #10284b;
  --color-stark-violet: #381fd1;
  --color-highlighter-yellow: #fedb63;
  --color-lilac-tint: #e5e0ff;
  --color-mint-splash: #99d6cc;
  --color-page-canvas: #faf5ff;
  --color-cream-field: #f6f6eb;
  --color-carbon: #000000;
  --color-pure-white: #ffffff;
  --color-hairline-gray: #e5e7eb;

  /* Typography */
  --font-armingrotesk: 'ArminGrotesk', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-robotomono: 'RobotoMono', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;

  /* Typography — Scale */
  --text-caption: 14px;
  --leading-caption: 1.43;
  --tracking-caption: -0.28px;
  --text-body-sm: 16px;
  --leading-body-sm: 1.5;
  --tracking-body-sm: -0.16px;
  --text-body: 20px;
  --leading-body: 1.7;
  --tracking-body: 0.4px;
  --text-subheading: 24px;
  --leading-subheading: 1.5;
  --text-heading-sm: 28px;
  --leading-heading-sm: 1.5;
  --text-heading: 48px;
  --leading-heading: 1.1;
  --tracking-heading: -0.48px;
  --text-heading-lg: 56px;
  --leading-heading-lg: 1.1;
  --tracking-heading-lg: -0.56px;
  --text-display: 110px;
  --leading-display: 1.1;
  --tracking-display: -2.2px;

  /* Spacing */
  --spacing-8: 8px;
  --spacing-16: 16px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-40: 40px;
  --spacing-48: 48px;
  --spacing-56: 56px;
  --spacing-64: 64px;
  --spacing-80: 80px;
  --spacing-144: 144px;

  /* Border Radius */
  --radius-md: 6px;
  --radius-xl: 12px;
  --radius-2xl: 20px;
  --radius-3xl: 40px;
}
```
