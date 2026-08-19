# a16z speedrun — Style Reference
> Monochrome broadsheet with a mint launch flare. A near-grayscale newspaper-grade layout, nearly devoid of color, where one multicolor gradient button cuts through the silence like a countdown timer lighting up.

**Theme:** light

a16z speedrun operates on near-zero chroma: a 1% colorfulness canvas of cool grays, warm beige washes, and pure white surfaces, interrupted by one signature gradient (mint → cyan → blue → purple) that acts as a signal flare for action. The typography does all the emotional work — messinaSans at weights 600–900 with aggressively tight tracking on display sizes, paired with messinaSansCondensed for uppercase eyebrows that breathe outward. Layout alternates between full-bleed dark photography heroes (where the mint gradient becomes the only light source) and airy white card grids at 12px radius. Components are deliberately flat: no shadows, only hairline borders, with color reserved exclusively for brand expression and the single primary action.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Cloud Gray | `#e5e7eb` | `--color-cloud-gray` | Page canvas, card borders, hairline dividers, image frames — the dominant neutral that defines the surface field |
| Obsidian | `#000000` | `--color-obsidian` | Primary text, filled action buttons, hero overlays, footer — the anchor that gives the minimal palette its weight |
| Paper White | `#ffffff` | `--color-paper-white` | Card surfaces, content backgrounds, button text on dark fills |
| Sand Beige | `#e2dfd8` | `--color-sand-beige` | Soft section background, alternate surface, and quiet card fill. |
| Graphite | `#5e5d5c` | `--color-graphite` | Muted body text, secondary links, helper text — recedes so Obsidian can lead |
| Speedrun Gradient | `linear-gradient(90deg, #00c6c6 0%, #00b5f4 20%, #00a1ff 40%, #398cff 50%, #757aff 60%, #906dff 75%, #a162ff 100%)` | `--color-speedrun-gradient` | Supporting palette color for small decorative accents when the core palette needs contrast. Do not promote it to the primary CTA color; Decorative radial gradient bloom — used as ambient atmosphere behind text, never as a functional fill |

## Tokens — Typography

### messinaSans — Display, headings, body, navigation — the only voice. Weight 900 at display sizes with -0.074em tracking creates a condensed, almost stenciled confidence. The 243px hero size is anti-scale: most sites stop at 72–96px, this pushes to nearly a quarter of the viewport height for maximum editorial impact · `--font-messinasans`
- **Substitute:** Inter (700–900) or Söhne Breit
- **Weights:** 600, 700, 900
- **Sizes:** 13px, 16px, 20px, 32px, 48px, 64px, 72px, 243px
- **Line height:** 1.0, 1.2, 1.23, 1.25, 1.5
- **Letter spacing:** -0.074em (243px) → -0.05em (64–72px) → -0.03em (32–48px) → -0.01em (16–20px)
- **Role:** Display, headings, body, navigation — the only voice. Weight 900 at display sizes with -0.074em tracking creates a condensed, almost stenciled confidence. The 243px hero size is anti-scale: most sites stop at 72–96px, this pushes to nearly a quarter of the viewport height for maximum editorial impact

### messinaSansCondensed — Uppercase eyebrow labels, category tags, button text — the counter-rhythm to messinaSans. Where the display font compresses inward, this one expands outward with +0.06em tracking, creating a typographic call-and-response where labels feel like they're announcing the headline · `--font-messinasanscondensed`
- **Substitute:** Inter Tight (600, uppercase) or Söhne Schmal
- **Weights:** 600
- **Sizes:** 12px, 16px, 18px
- **Line height:** 1.11, 1.25, 1.33
- **Letter spacing:** 0.04em, 0.06em
- **Role:** Uppercase eyebrow labels, category tags, button text — the counter-rhythm to messinaSans. Where the display font compresses inward, this one expands outward with +0.06em tracking, creating a typographic call-and-response where labels feel like they're announcing the headline

### Messina Sans — Messina Sans — detected in extracted data but not described by AI · `--font-messina-sans`
- **Weights:** 600
- **Sizes:** 16px
- **Line height:** 1.5
- **Letter spacing:** -0.03
- **Role:** Messina Sans — detected in extracted data but not described by AI

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 12px | 1.33 | 0.72px | `--text-caption` |
| body | 16px | 1.5 | -0.48px | `--text-body` |
| subheading | 20px | 1.25 | -0.2px | `--text-subheading` |
| heading-sm | 32px | 1.23 | -0.96px | `--text-heading-sm` |
| heading | 48px | 1.2 | -1.44px | `--text-heading` |
| heading-lg | 64px | 1.2 | -3.2px | `--text-heading-lg` |
| display | 72px | 1 | -3.6px | `--text-display` |
| hero | 243px | 1 | -17.98px | `--text-hero` |

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
| 36 | 36px | `--spacing-36` |
| 40 | 40px | `--spacing-40` |
| 44 | 44px | `--spacing-44` |
| 56 | 56px | `--spacing-56` |
| 80 | 80px | `--spacing-80` |
| 96 | 96px | `--spacing-96` |

### Border Radius

| Element | Value |
|---------|-------|
| nav | 8px |
| cards | 12px |
| images | 12px |
| buttons | 8px |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 40px
- **Card padding:** 12px
- **Element gap:** 12px

## Components

### Speedrun Gradient Button
**Role:** Primary action

Filled button with full mint-to-violet linear gradient (#00c6c6 → #00b5f4 → #00a1ff → #398cff → #757aff → #906dff → #a162ff), 8px border-radius, 8px vertical / 24–56px horizontal padding, messinaSansCondensed 600 at 12–16px with 0.04–0.06em letter-spacing, uppercase white text. This is the ONLY chromatic fill in the entire system — every other button is neutral.

### Obsidian Filled Button
**Role:** Secondary action

Solid #000000 background, 8px radius, 8px×24px padding, white messinaSansCondensed 600 uppercase text at 12–16px. Used when the gradient button is already present on a page and a second action is needed.

### Ghost Text Link
**Role:** Tertiary navigation

No background, no border. Obsidian text in messinaSans 600 at 16px, underline on hover. Used for LOG IN, footer links, and inline references where visual weight must be zero.

### Gradient Wordmark
**Role:** Brand identity

The word 'speedrun' rendered in messinaSans 700 italic with the full multicolor gradient as fill. The forward-slash separator and 'a16z' prefix remain Obsidian. This is the most recognizable brand asset — the gradient IS the logo.

### Hero Photography Block
**Role:** Hero section

Full-bleed dark photograph (stage/speaker imagery) with a left-aligned content stack: messinaSansCondensed eyebrow in gradient fill at 12px / 0.06em, display headline in #ffffff at 48–72px / weight 900, gradient APPLY NOW button below. The photo is desaturated to near-monochrome so the gradient button becomes the only color source.

### Feature Card
**Role:** Content card

12px border-radius, #ffffff surface on #e5e7eb canvas, no shadow. Image (12px radius) at top, then 24px internal padding containing: messinaSansCondensed 600 12px uppercase category label, messinaSans 700 20–32px heading, body text at 16px. Hairline #e5e7eb border may separate from canvas if needed.

### Eyebrow Label
**Role:** Section/category identifier

messinaSansCondensed 600 at 12px, uppercase, 0.06em letter-spacing, Obsidian or gradient fill. Always precedes a heading and acts as a typographic drumbeat announcing the content below.

### Section Heading
**Role:** Section title

messinaSans 900 at 32–48px, -0.03em letter-spacing, Obsidian. Left-aligned with a 1px #e5e7eb hairline divider running the full content width below it.

### Display Headline
**Role:** Hero / page-level headline

messinaSans 900 at 64–243px, tight line-height (1.0), -0.05em to -0.074em letter-spacing. At 243px the tracking compresses to -18px, making each word read as a dense block of ink rather than spaced text.

### Top Navigation Bar
**Role:** Site navigation

Horizontal bar, #ffffff or transparent background, 8px padding, logo on the left, nav links centered (messinaSans 600 at 16px in Obsidian, 12–24px gap), APPLY NOW gradient button + LOG IN text link on the right. No border, no shadow — the nav floats on the page.

### Image Container
**Role:** Media display

12px border-radius, 1px #e5e7eb border to define edge against the gray canvas. Used for event photos, founder portraits, and demo imagery throughout feature cards and grids.

### Card Grid
**Role:** Multi-card content layout

3-column grid at desktop, 12px column-gap, 40px row-gap. Each cell is a Feature Card. Grid sits on the #e5e7eb canvas so white cards read as elevated without needing shadow.

## Do's and Don'ts

### Do
- Use the full multicolor gradient (mint→cyan→blue→violet) exclusively on one element per view: the primary action button or the logo wordmark. Never dilute it across multiple components.
- Set display headlines at messinaSans 900 with letter-spacing of -0.05em or tighter. The compression is what makes the type feel architectural, not just big.
- Place messinaSansCondensed uppercase labels with +0.06em tracking directly above headlines. This negative-then-positive tracking creates the system's signature typographic rhythm.
- Use 12px border-radius for all cards and images, 8px for all buttons. This two-radius system is the entire shape language — do not introduce a third value.
- Keep 90%+ of the interface achromatic. Let the 1% colorfulness carry all the brand expression. Gray-on-white is the default, not the fallback.
- Set section gaps at 40px and card padding at 12px as the rhythmic baseline. Use 56px horizontal padding on gradient buttons for breathing room around uppercase text.
- Render dark photography heroes with desaturated or near-monochrome treatment so the gradient CTA becomes the sole color accent in the viewport.

### Don't
- Do not use #000000 for large filled areas in content sections — reserve it for text, the nav footer, and Obsidian buttons only.
- Do not apply drop-shadows to cards, buttons, or modals. Elevation must come from value contrast, not blur.
- Do not introduce additional border-radius values beyond 8px (buttons) and 12px (cards/images). No pill buttons, no 4px chips, no 16px+ panels.
- Do not use the gradient as a background fill, panel color, or section wash. It is a signal, not a surface.
- Do not use messinaSans at weights below 600. The system relies on heavy weight to create presence; light or regular weights would collapse the editorial voice.
- Do not mix color temperatures — the palette is cool (gray, white) with one warm beige (#e2dfd8) reserved for gradient origins. Never add warm browns, oranges, or saturated reds.
- Do not use positive letter-spacing on messinaSans — only messinaSansCondensed earns the +0.04em to +0.06em tracking for uppercase labels.

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 1 | Canvas | `#e5e7eb` | Full-page background — cool light gray, the visual ground plane |
| 2 | Card | `#ffffff` | Content cards, feature blocks, image containers sitting on canvas |
| 3 | Warm Wash | `#e2dfd8` | Gradient origin beige — used behind the hero text gradient to add warmth |
| 4 | Obsidian | `#000000` | Dark photography heroes, filled buttons, footer — the elevated dark surface |

## Elevation

No shadows. Elevation is expressed purely through value contrast: white cards on gray canvas, dark hero photos with overlaid white text, gradient buttons as the only chromatic elevation. The absence of drop-shadow is deliberate — shadows would soften the editorial, almost printed broadsheet feel.

## Imagery

Photography is the secondary visual system, deployed at two scales: full-bleed dark hero imagery (founder/builder on stage, event spaces, pitch environments) and contained event photos within feature cards (12px radius, 1px gray border). All photography is treated with heavy desaturation or near-monochrome grading so the mint gradient CTA becomes the only color source in the hero viewport. The photographic style is candid, documentary, and slightly underexposed — it captures momentum, not polish. There is no illustration, no 3D render, no abstract graphic. Images serve to show the human/textural reality of building, not to decorate. Iconography is minimal: the wordmark itself is the primary visual mark, with functional icons (arrows, close) used sparingly in 1.5px Obsidian stroke.

## Layout

Page model: max-width 1200px centered content, but hero sections break to full-bleed. The page alternates between two visual modes: (1) dark full-bleed photography heroes with left-aligned overlaid text, and (2) airy light sections with centered 1200px content on #e5e7eb canvas. Content sections use 40px vertical gaps. Feature grids are 3-column at desktop with 12px column gaps. Section rhythm follows: dark hero → white card grid → light text section → repeat. Navigation is a single top bar (not sticky), floating on the page with no shadow. The layout reads top-to-bottom like a broadsheet: a dramatic dark cover, then white 'pages' of content, each section announcing itself with a condensed-font eyebrow above a heavy-weight heading.

## Agent Prompt Guide

**Quick Color Reference**
- text (primary): #000000
- text (muted): #5e5d5c
- background (page): #e5e7eb
- background (card): #ffffff
- border (hairline): #e5e7eb
- accent (gradient): linear-gradient(90deg, #00c6c6, #00b5f4, #00a1ff, #398cff, #757aff, #906dff, #a162ff)
- primary action: #000000 (filled action)

**3-5 Example Component Prompts**

1. Create a Primary Action Button: #000000 background, #ffffff text, 9999px radius, compact pill padding. Use this filled treatment for the main CTA.

2. **Feature card grid (3-column):** Canvas #e5e7eb. Cards: #ffffff, 12px radius, 24px internal padding, 1px #e5e7eb border. Each card: image at top (12px radius, 1px #e5e7eb border), then 16px gap, then category label (messinaSansCondensed 600, 12px, uppercase, 0.06em, #000000), then heading (messinaSans 700, 24px, -0.48px, #000000), then body (messinaSans 400, 16px, 1.5 line-height, #5e5d5c). Column gap: 12px, row gap: 40px.

3. **Top navigation bar:** White or transparent background, full-width. Left: gradient wordmark ('speedrun' in messinaSans 700 italic with multicolor gradient fill, 'a16z/' prefix in #000000). Center: nav links in messinaSans 600, 16px, #000000, 12px gap, uppercase. Right: gradient APPLY NOW button (same spec as hero CTA) + LOG IN ghost text link in messinaSans 600, 16px, #000000.

4. **Display headline section:** Canvas #e5e7eb. Eyebrow: messinaSansCondensed 600, 12px, uppercase, 0.06em, #000000, margin-bottom 20px. Headline: messinaSans 900, 48px, -1.44px letter-spacing, line-height 1.2, #000000. Hairline 1px #e5e7eb divider below, full content width.

5. **Card with embedded image and body content:** #ffffff surface, 12px radius, 12px internal padding. Image: 12px radius, 1px #e5e7eb border, full card width, 24px margin-bottom. Category label: messinaSansCondensed 600, 12px, uppercase, 0.06em, #000000. Title: messinaSans 700, 32px, -0.96px, #000000. Body: messinaSans 400, 16px, line-height 1.5, #5e5d5c.

## Gradient System

One gradient, two modes of deployment:

1. **Full spectrum (mint→cyan→blue→violet):** Used exclusively for the logo wordmark, the primary CTA button, and eyebrow labels that need to feel 'live'. This is the brand's voice — deploying it elsewhere dilutes its signal.

2. **Violet radial bloom (#a162ff fading to transparent):** Used as ambient atmosphere behind hero text or as a subtle section wash. Always positioned at 0% horizontal, 0–8% vertical anchor. Never used as a full background or panel fill.

The gradient direction is always left-to-right (90deg) for the linear version. Never vertical, never diagonal — the horizontal sweep reads as a 'launch' or 'run' motion.

## Similar Brands

- **Y Combinator** — Same near-monochrome editorial style with a single accent color for CTAs, and similar typographic confidence using heavy sans-serif at large display sizes
- **Antler** — Same flat card-grid layout on a light gray canvas with 12px radii, and similar use of full-bleed dark photography heroes alternating with airy content sections
- **Stripe Press** — Same broadsheet editorial approach — heavy condensed type, generous whitespace, photography that feels like a magazine spread rather than a SaaS dashboard
- **Linear** — Same dark-mode photography paired with gradient-accented CTAs, and similar commitment to a near-zero-chroma interface where a single gradient carries all the brand expression
- **Pear VC** — Same minimalist fund/accelerator layout pattern — dark hero, white card grids, uppercase category labels above bold headlines, single accent gradient for action

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-cloud-gray: #e5e7eb;
  --color-obsidian: #000000;
  --color-paper-white: #ffffff;
  --color-sand-beige: #e2dfd8;
  --color-graphite: #5e5d5c;
  --color-speedrun-gradient: #a162ff;
  --gradient-speedrun-gradient: linear-gradient(90deg, #00c6c6 0%, #00b5f4 20%, #00a1ff 40%, #398cff 50%, #757aff 60%, #906dff 75%, #a162ff 100%);

  /* Typography — Font Families */
  --font-messinasans: 'messinaSans', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-messinasanscondensed: 'messinaSansCondensed', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-messina-sans: 'Messina Sans', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.33;
  --tracking-caption: 0.72px;
  --text-body: 16px;
  --leading-body: 1.5;
  --tracking-body: -0.48px;
  --text-subheading: 20px;
  --leading-subheading: 1.25;
  --tracking-subheading: -0.2px;
  --text-heading-sm: 32px;
  --leading-heading-sm: 1.23;
  --tracking-heading-sm: -0.96px;
  --text-heading: 48px;
  --leading-heading: 1.2;
  --tracking-heading: -1.44px;
  --text-heading-lg: 64px;
  --leading-heading-lg: 1.2;
  --tracking-heading-lg: -3.2px;
  --text-display: 72px;
  --leading-display: 1;
  --tracking-display: -3.6px;
  --text-hero: 243px;
  --leading-hero: 1;
  --tracking-hero: -17.98px;

  /* Typography — Weights */
  --font-weight-semibold: 600;
  --font-weight-bold: 700;
  --font-weight-black: 900;

  /* Spacing */
  --spacing-unit: 4px;
  --spacing-4: 4px;
  --spacing-8: 8px;
  --spacing-12: 12px;
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-36: 36px;
  --spacing-40: 40px;
  --spacing-44: 44px;
  --spacing-56: 56px;
  --spacing-80: 80px;
  --spacing-96: 96px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 40px;
  --card-padding: 12px;
  --element-gap: 12px;

  /* Border Radius */
  --radius-lg: 8px;
  --radius-xl: 12px;

  /* Named Radii */
  --radius-nav: 8px;
  --radius-cards: 12px;
  --radius-images: 12px;
  --radius-buttons: 8px;

  /* Surfaces */
  --surface-canvas: #e5e7eb;
  --surface-card: #ffffff;
  --surface-warm-wash: #e2dfd8;
  --surface-obsidian: #000000;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-cloud-gray: #e5e7eb;
  --color-obsidian: #000000;
  --color-paper-white: #ffffff;
  --color-sand-beige: #e2dfd8;
  --color-graphite: #5e5d5c;
  --color-speedrun-gradient: #a162ff;

  /* Typography */
  --font-messinasans: 'messinaSans', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-messinasanscondensed: 'messinaSansCondensed', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-messina-sans: 'Messina Sans', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.33;
  --tracking-caption: 0.72px;
  --text-body: 16px;
  --leading-body: 1.5;
  --tracking-body: -0.48px;
  --text-subheading: 20px;
  --leading-subheading: 1.25;
  --tracking-subheading: -0.2px;
  --text-heading-sm: 32px;
  --leading-heading-sm: 1.23;
  --tracking-heading-sm: -0.96px;
  --text-heading: 48px;
  --leading-heading: 1.2;
  --tracking-heading: -1.44px;
  --text-heading-lg: 64px;
  --leading-heading-lg: 1.2;
  --tracking-heading-lg: -3.2px;
  --text-display: 72px;
  --leading-display: 1;
  --tracking-display: -3.6px;
  --text-hero: 243px;
  --leading-hero: 1;
  --tracking-hero: -17.98px;

  /* Spacing */
  --spacing-4: 4px;
  --spacing-8: 8px;
  --spacing-12: 12px;
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-36: 36px;
  --spacing-40: 40px;
  --spacing-44: 44px;
  --spacing-56: 56px;
  --spacing-80: 80px;
  --spacing-96: 96px;

  /* Border Radius */
  --radius-lg: 8px;
  --radius-xl: 12px;
}
```
