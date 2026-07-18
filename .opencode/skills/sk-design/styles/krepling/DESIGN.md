# Krepling — Style Reference
> Quiet white atelier with one violet spark

**Theme:** light

Krepling's design system is a near-monochrome canvas where black text and white surfaces carry the interface, and a single vivid violet (Bolt Violet) provides the only chromatic voice for actions, links, and interactive states. The layout breathes: generous whitespace, a comfortable density, and section rhythm built from large typographic jumps (16px → 80px) rather than colored bands. Surfaces are flat — borders and subtle background tints (#f1f1f1) define elevation; shadows are essentially absent. Rounded geometry is consistent (8px for cards/buttons, 14px for larger containers), reinforcing a soft, approachable feel. The system is counterweighted by playful 3D-rendered decorative objects in saturated hues — these are pure atmosphere, never UI tokens.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Bolt Violet | `#b154f9` | `--color-bolt-violet` | Filled CTA backgrounds, link borders, active tab indicators — the sole chromatic signal in the system |
| Ink Black | `#000000` | `--color-ink-black` | Primary text, headings, icon strokes, nav labels, all hairline borders and dividers |
| Paper White | `#ffffff` | `--color-paper-white` | Page canvas, card surfaces, button text on filled CTAs, reversed text in dark zones |
| Mist Gray | `#f1f1f1` | `--color-mist-gray` | Alt-surface tint for sub-sections, secondary card backgrounds, hover wash |
| Charcoal | `#171717` | `--color-charcoal` | Footer background, near-black text where softer than pure ink is needed |
| Steel Gray | `#6c6b6b` | `--color-steel-gray` | Secondary/helper text, muted icons, disabled states, low-priority borders |
| Fog Gray | `#b3b3b3` | `--color-fog-gray` | Subtle card borders, placeholder text, low-contrast dividers |

## Tokens — Typography

### Regular — Regular — detected in extracted data but not described by AI · `--font-regular`
- **Weights:** 400
- **Sizes:** 16px, 18px, 24px, 32px, 48px, 64px, 80px
- **Line height:** 1.1, 1.2, 1.3
- **Letter spacing:** -0.01, 0.01, 0.02
- **Role:** Regular — detected in extracted data but not described by AI

### Custom Sans (Krepling Regular) — Single-weight grotesk used for every text role — body, headings, nav, buttons. A weight-400-only system is a deliberate signature: hierarchy is built through size and tracking, not boldness, producing a calm, editorial, anti-shout tone. Free substitute: Inter at 400, or Söhne Buch. · `--font-custom-sans-krepling-regular`
- **Substitute:** Inter
- **Weights:** 400
- **Sizes:** 16, 18, 24, 32, 48, 64, 80px
- **Line height:** 1.10–1.30
- **Letter spacing:** -0.01em at 48–80px, 0.01em at 16–24px, 0.02em at small caps/labels
- **Role:** Single-weight grotesk used for every text role — body, headings, nav, buttons. A weight-400-only system is a deliberate signature: hierarchy is built through size and tracking, not boldness, producing a calm, editorial, anti-shout tone. Free substitute: Inter at 400, or Söhne Buch.

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 16px | 1.3 | 0.01px | `--text-caption` |
| body | 18px | 1.3 | 0.01px | `--text-body` |
| subheading | 24px | 1.2 | 0.01px | `--text-subheading` |
| heading-sm | 32px | 1.2 | — | `--text-heading-sm` |
| heading | 48px | 1.2 | -0.01px | `--text-heading` |
| heading-lg | 64px | 1.1 | -0.01px | `--text-heading-lg` |
| display | 80px | 1.1 | -0.01px | `--text-display` |

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
| 32 | 32px | `--spacing-32` |
| 48 | 48px | `--spacing-48` |
| 96 | 96px | `--spacing-96` |
| 128 | 128px | `--spacing-128` |
| 192 | 192px | `--spacing-192` |
| 240 | 240px | `--spacing-240` |

### Border Radius

| Element | Value |
|---------|-------|
| cards | 8px |
| buttons | 8px |
| hero panels | 30px |
| large containers | 14px |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 80px
- **Card padding:** 20px
- **Element gap:** 8px

## Components

### Filled Violet Button
**Role:** Primary action — 'Request a demo', submit

Background #b154f9, text #ffffff, radius 8px, padding 14px 20px, weight 400 at 16–18px. The only filled button in the system.

### Outlined Violet Button
**Role:** Secondary action — 'Get started' in nav

Background #ffffff, border 1.5px #b154f9, text #b154f9, radius 8px, padding 14px 20px. Inverse of the filled variant — same hue, transparent fill.

### Ghost Text Link
**Role:** Nav links, inline links

No background, text #000000 at 16–18px, hover shifts to #b154f9. Underline only on hover.

### Header / Top Nav
**Role:** Global navigation bar

White background, 1px bottom border in Ink Black at low opacity. Left: wordmark logo. Center: text nav at 16–18px. Right: 'Log in' ghost link + outlined violet 'Get started' button. Padding ~21px vertical.

### Hero Block
**Role:** First-screen headline and subtext

Max-width ~1200px centered. Display headline 64–80px weight 400 with -0.01em tracking, left-aligned, black on white. Supporting subtext 18–24px, #000000, right-aligned or beside CTA. Filled violet CTA below subtext.

### 3D Decorative Object Cluster
**Role:** Atmospheric hero/section visuals

Pastel gradient cubes/spheres in saturated hues (coral, lavender, mint, sky, yellow) rendered as 3D illustrations. Always floating, soft-shadow, no sharp edges. Purely decorative — never informational.

### Feature Section Heading
**Role:** Section opener with icon + title

Small black icon (~32–40px) in a rounded square, paired with a 48–64px weight-400 heading. Example: 'Workflows' with a black icon tile to its left.

### Tab Strip
**Role:** In-section navigation (Workflows / Storefront / Dashboard)

Horizontal pill-shaped tabs, each 8px radius, padding 10–14px vertical / 18–20px horizontal. Inactive: #ffffff bg, #000000 text, 1px border. Active: #b154f9 border or fill indicator.

### Content Card
**Role:** Generic card container for features, pricing, content blocks

Background #ffffff or #f1f1f1, 1px border in Fog Gray or Ink Black at low opacity, radius 8px, padding 20px. No drop shadow.

### FAQ Accordion Row
**Role:** Expandable question/answer list

Full-width row, 1px Ink Black bottom border (no top/left/right border), padding 20px vertical, question text 16–18px weight 400 #000000, chevron icon on the right in #000000. Expands inline with answer in #6c6b6b.

### Footer
**Role:** Site footer

Background #171717, text and links in #ffffff, generous vertical padding, multi-column link grid. Inverts the entire light system to near-black.

## Do's and Don'ts

### Do
- Use #b154f9 exclusively for filled CTAs, outlined CTAs, and active tab/link states — it is the system's only chromatic voice
- Build hierarchy with size and tracking (16→80px, -0.01em on displays), never with bold weight — the font ships in weight 400 only
- Use 8px radius for all buttons, cards, and small containers; 14px for larger panels; 30px only for hero-scale surfaces
- Communicate elevation with 1px borders in Ink Black or Fog Gray, or with the Mist Gray (#f1f1f1) alt-surface — never with drop shadows
- Let the 3D decorative objects carry all color in hero/section compositions; the surrounding UI must stay achromatic so the objects pop
- Set the page canvas to #ffffff and the page max-width to 1200px centered; let vertical rhythm (80px section gaps) create the pacing
- Reverse to #171717 with #ffffff text only in the footer — keep every other surface light

### Don't
- Do not introduce a second brand color into the UI palette — the violet must remain the only chromatic accent
- Do not use weight 600 or 700 — there is no bold; hierarchy must come from size
- Do not apply drop shadows to cards, buttons, or modals — the system is deliberately flat
- Do not use 4px or 12px radius on cards or buttons — stick to 8px / 14px / 30px
- Do not set body text below 16px or above line-height 1.3 — the scale is opinionated
- Do not place UI text in any of the decorative illustration hues (coral, mint, yellow, etc.) — those are artwork-only
- Do not alternate dark and light section bands — the page is light throughout, with the footer as the single dark inversion

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Paper White | `#ffffff` | Page canvas, default card surface |
| 1 | Mist Gray | `#f1f1f1` | Alt-section background, secondary surface |
| 2 | Charcoal | `#171717` | Footer / dark surface |

## Elevation

Elevation is communicated through border weight (1px Ink Black at 8–10% opacity) and background tint shifts, never drop shadows. The flatness is deliberate: the 3D decorative elements supply the only depth in the experience.

## Imagery

Imagery is dominated by 3D-rendered decorative objects: soft, rounded cubes and spheres in pastel-saturated hues (coral, lavender, mint, sky blue, butter yellow, pink) floating in composition with one another. They sit on pure white, occupy roughly 40–60% of hero/section real estate, and function purely as atmospheric brand texture — not as product screenshots or photography. No stock photography, no lifestyle imagery, no human figures. Iconography is monochrome black line/filled glyphs in small rounded squares (e.g., the Workflows icon tile). The 3D style is the visual signature: tactile, candy-like, and the only place saturated color is allowed.

## Layout

Centered max-width ~1200px container, full-bleed white canvas. The hero is a two-column composition: massive left-aligned display headline (64–80px) with a floating cluster of 3D decorative objects occupying the upper-right and center, and a smaller right-aligned subtext + filled violet CTA block in the lower-right. Below the hero, sections flow as single centered stacks or two-column text+visual blocks with 80px vertical gaps. The Workflows section uses a centered icon+headline opener followed by a full-width tab strip and content area. The FAQ section is a centered max-width column (~800px) of full-width accordion rows with hairline dividers. Navigation is a top bar, no sidebar, no sticky shadow. The single full-bleed dark surface is the footer.

## Agent Prompt Guide

**Quick Color Reference**
- text (primary): #000000
- text (muted/helper): #6c6b6b
- background: #ffffff
- alt-surface: #f1f1f1
- border (hairline): #000000 at low opacity or #b3b3b3
- accent / primary action: #b154f9 (filled action)
- primary action: #b154f9 (filled action)

**3-5 Example Component Prompts**

1. **Hero Section**: White #ffffff background, max-width 1200px centered. Display headline 'The world's most powerful commerce platform.' at 80px, weight 400, #000000, letter-spacing -0.01em, line-height 1.1, left-aligned. Subtext at 18px weight 400, #000000, placed right-aligned. Filled violet CTA 'Request a demo' below subtext: background #b154f9, text #ffffff, radius 8px, padding 14px 20px. Floating pastel 3D objects (coral/lavender/yellow cubes and spheres) in the upper-right quadrant — decorative only, no UI function.

2. **Header Nav Bar**: White background, 1px bottom border in #000000 at 10% opacity, padding 21px vertical. Left: 'KREPLING' wordmark in #000000. Center: nav links (Features, Pricing, Company, Resources) at 16px weight 400, #000000. Right: 'Log in' ghost text link in #000000, then outlined violet 'Get started' button — background #ffffff, border 1.5px #b154f9, text #b154f9, radius 8px, padding 14px 20px.

3. **Content Card**: Background #ffffff, border 1px in #b3b3b3, radius 8px, padding 20px. No shadow. Title at 24px weight 400 #000000, body at 16px weight 400 #6c6b6b.

4. **Tab Strip**: Horizontal row of three tabs (Workflows, Storefront, Dashboard). Each tab radius 8px, padding 14px 20px. Inactive tab: background #ffffff, text #000000, 1px border in #b3b3b3. Active tab: background #ffffff, border 1.5px #b154f9, text #000000.

5. **FAQ Accordion**: Full-width rows, 1px bottom border in #000000, padding 20px vertical. Question text 16px weight 400 #000000, chevron icon right-aligned in #000000. Expanded answer text 16px weight 400 #6c6b6b.

## Gradient System

Gradients are not used on UI surfaces. They exist only inside the 3D decorative illustrations, where pastel endpoints blend softly (e.g. coral→lavender, sky→mint, lavender→peach, blue→violet). Never apply these to buttons, cards, or backgrounds.

## Similar Brands

- **Stripe** — Same near-monochrome white canvas with a single signature color carrying all interactive state; same comfortable density and large display type.
- **Linear** — Same flat-surface philosophy with hairline borders instead of shadows, generous whitespace, and one chromatic accent per surface.
- **Notion** — Same quiet white-base UI, weight-400-only typographic voice, rounded geometry, and decorative 3D illustration as atmospheric brand texture.
- **Framer** — Same playful 3D decorative objects floating on white, large editorial display type at weight 400, and minimal chromatic UI palette.

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-bolt-violet: #b154f9;
  --color-ink-black: #000000;
  --color-paper-white: #ffffff;
  --color-mist-gray: #f1f1f1;
  --color-charcoal: #171717;
  --color-steel-gray: #6c6b6b;
  --color-fog-gray: #b3b3b3;

  /* Typography — Font Families */
  --font-regular: 'Regular', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-custom-sans-krepling-regular: 'Custom Sans (Krepling Regular)', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 16px;
  --leading-caption: 1.3;
  --tracking-caption: 0.01px;
  --text-body: 18px;
  --leading-body: 1.3;
  --tracking-body: 0.01px;
  --text-subheading: 24px;
  --leading-subheading: 1.2;
  --tracking-subheading: 0.01px;
  --text-heading-sm: 32px;
  --leading-heading-sm: 1.2;
  --text-heading: 48px;
  --leading-heading: 1.2;
  --tracking-heading: -0.01px;
  --text-heading-lg: 64px;
  --leading-heading-lg: 1.1;
  --tracking-heading-lg: -0.01px;
  --text-display: 80px;
  --leading-display: 1.1;
  --tracking-display: -0.01px;

  /* Typography — Weights */
  --font-weight-regular: 400;

  /* Spacing */
  --spacing-unit: 4px;
  --spacing-4: 4px;
  --spacing-8: 8px;
  --spacing-12: 12px;
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-32: 32px;
  --spacing-48: 48px;
  --spacing-96: 96px;
  --spacing-128: 128px;
  --spacing-192: 192px;
  --spacing-240: 240px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 80px;
  --card-padding: 20px;
  --element-gap: 8px;

  /* Border Radius */
  --radius-lg: 8px;
  --radius-xl: 14px;
  --radius-3xl: 30px;

  /* Named Radii */
  --radius-cards: 8px;
  --radius-buttons: 8px;
  --radius-hero-panels: 30px;
  --radius-large-containers: 14px;

  /* Surfaces */
  --surface-paper-white: #ffffff;
  --surface-mist-gray: #f1f1f1;
  --surface-charcoal: #171717;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-bolt-violet: #b154f9;
  --color-ink-black: #000000;
  --color-paper-white: #ffffff;
  --color-mist-gray: #f1f1f1;
  --color-charcoal: #171717;
  --color-steel-gray: #6c6b6b;
  --color-fog-gray: #b3b3b3;

  /* Typography */
  --font-regular: 'Regular', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-custom-sans-krepling-regular: 'Custom Sans (Krepling Regular)', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 16px;
  --leading-caption: 1.3;
  --tracking-caption: 0.01px;
  --text-body: 18px;
  --leading-body: 1.3;
  --tracking-body: 0.01px;
  --text-subheading: 24px;
  --leading-subheading: 1.2;
  --tracking-subheading: 0.01px;
  --text-heading-sm: 32px;
  --leading-heading-sm: 1.2;
  --text-heading: 48px;
  --leading-heading: 1.2;
  --tracking-heading: -0.01px;
  --text-heading-lg: 64px;
  --leading-heading-lg: 1.1;
  --tracking-heading-lg: -0.01px;
  --text-display: 80px;
  --leading-display: 1.1;
  --tracking-display: -0.01px;

  /* Spacing */
  --spacing-4: 4px;
  --spacing-8: 8px;
  --spacing-12: 12px;
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-32: 32px;
  --spacing-48: 48px;
  --spacing-96: 96px;
  --spacing-128: 128px;
  --spacing-192: 192px;
  --spacing-240: 240px;

  /* Border Radius */
  --radius-lg: 8px;
  --radius-xl: 14px;
  --radius-3xl: 30px;
}
```
