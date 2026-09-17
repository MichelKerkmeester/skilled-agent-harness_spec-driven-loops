# Pixso — Style Reference
> pristine designer's canvas flooded with morning light

**Theme:** light

Pixso's marketing surface is a near-monochrome gallery: a warm-white canvas, hairline borders, and black headline type let the colorful product work and design kit thumbnails do the visual talking. Figtree carries the entire voice in a wide weight range — whispers at 400, confident at 600, and a wall of presence at 700 for the hero statement. The only chromatic punctuation is a single pale-blue wash and a purple-to-blue logo gradient; everything else earns its color by showing real product, not decoration. Components sit flat with very soft shadows and modest radii, so the page feels like a designer's tool laid out on a marble desk — the tools are quiet, the work is loud.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Obsidian | `#000000` | `--color-obsidian` | Primary text, heading type, dark icons, and the strongest foreground layer |
| Carbon | `#121212` | `--color-carbon` | Filled primary buttons, active nav state, dark surface fill |
| Graphite | `#333333` | `--color-graphite` | Secondary headings, button labels on light surfaces, heavy icon strokes |
| Slate | `#666666` | `--color-slate` | Body secondary text, helper copy, muted metadata |
| Ash | `#808080` | `--color-ash` | Tertiary text, disabled states, placeholder copy, subtle borders |
| Fog | `#999999` | `--color-fog` | Inactive icons, low-emphasis dividers, shadow tinting |
| Pebble | `#8b8c8f` | `--color-pebble` | Icon strokes on neutral surfaces, muted glyph color |
| Smoke | `#4d4d4d` | `--color-smoke` | Heavy body text where Obsidian feels too sharp, small caption emphasis |
| Charcoal Veil | `#3d3d3d` | `--color-charcoal-veil` | Navigation bar text and borders — the dark nav strip registers as a separate layer |
| Dusk | `#292929` | `--color-dusk` | Deep surface fill for elevated dark blocks and image overlays |
| Paper | `#faf8fd` | `--color-paper` | Page canvas — barely-there warm/lavender tint that separates the site from pure white |
| Bone | `#f9f9fa` | `--color-bone` | Card surfaces, secondary panels, subtle raised containers |
| Mist | `#eaebee` | `--color-mist` | Hairline borders, divider rules, button outlines, input borders |
| Ice Wash | `#cfe7ed` | `--color-ice-wash` | Pale cool-blue background tint for highlighted cards and feature panels |
| Iris Sweep | `linear-gradient(88deg, #ee7cff 1.37%, #4e6fff 45.72%, #559cff 106.06%)` | `--color-iris-sweep` | Brand logo gradient midpoint — the wordmark's signature purple-to-blue sweep |
| Orchid Edge | `#ee7cff` | `--color-orchid-edge` | Brand logo gradient start — warm violet anchor of the wordmark sweep |
| Sky Drift | `#559cff` | `--color-sky-drift` | Brand logo gradient end — cool blue terminus of the wordmark sweep |

## Tokens — Typography

### Figtree — Single-family system: 700 carries the hero and section headlines at 48–60px with tight tracking, 600 handles subheadings and prominent labels at 24–34px, 500 covers button labels and emphasized body at 16–18px, 400 runs body and caption copy at 13–16px. The geometric, low-contrast character of Figtree keeps the all-black type from feeling oppressive. · `--font-figtree`
- **Substitute:** Inter, DM Sans, Manrope
- **Weights:** 400, 500, 600, 700
- **Sizes:** 12px, 13px, 14px, 16px, 18px, 24px, 28px, 30px, 34px, 48px, 50px, 60px
- **Line height:** 1.10–1.61 (display tight at 1.10–1.17, body generous at 1.50–1.61)
- **Role:** Single-family system: 700 carries the hero and section headlines at 48–60px with tight tracking, 600 handles subheadings and prominent labels at 24–34px, 500 covers button labels and emphasized body at 16–18px, 400 runs body and caption copy at 13–16px. The geometric, low-contrast character of Figtree keeps the all-black type from feeling oppressive.

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 12px | 1.5 | — | `--text-caption` |
| body | 14px | 1.6 | — | `--text-body` |
| body-lg | 16px | 1.55 | — | `--text-body-lg` |
| subheading | 18px | 1.5 | — | `--text-subheading` |
| heading-sm | 24px | 1.3 | — | `--text-heading-sm` |
| heading | 30px | 1.21 | — | `--text-heading` |
| heading-lg | 34px | 1.21 | — | `--text-heading-lg` |
| display | 48px | 1.17 | — | `--text-display` |
| display-lg | 60px | 1.1 | — | `--text-display-lg` |

## Tokens — Spacing & Shapes

**Density:** comfortable

### Spacing Scale

| Name | Value | Token |
|------|-------|-------|
| 4 | 4px | `--spacing-4` |
| 5 | 5px | `--spacing-5` |
| 6 | 6px | `--spacing-6` |
| 7 | 7px | `--spacing-7` |
| 8 | 8px | `--spacing-8` |
| 10 | 10px | `--spacing-10` |
| 12 | 12px | `--spacing-12` |
| 14 | 14px | `--spacing-14` |
| 16 | 16px | `--spacing-16` |
| 17 | 17px | `--spacing-17` |
| 18 | 18px | `--spacing-18` |
| 20 | 20px | `--spacing-20` |
| 26 | 26px | `--spacing-26` |
| 30 | 30px | `--spacing-30` |
| 32 | 32px | `--spacing-32` |
| 50 | 50px | `--spacing-50` |

### Border Radius

| Element | Value |
|---------|-------|
| nav | 8px |
| cards | 8px |
| inputs | 8px |
| buttons | 12px |
| buttons-prominent | 18px |

### Shadows

| Name | Value | Token |
|------|-------|-------|
| sm | `rgba(0, 0, 0, 0.04) 0px 2px 4px 0px, rgba(0, 0, 0, 0.3) 0...` | `--shadow-sm` |
| subtle | `rgba(0, 0, 0, 0.1) 0px 1px 1px 0px, rgba(0, 0, 0, 0.4) 0p...` | `--shadow-subtle` |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 80px
- **Card padding:** 20px
- **Element gap:** 10px

## Components

### Filled Primary Button
**Role:** Main conversion action — the loudest UI element on the page

#121212 background, #ffffff text, Figtree 500 at 14–16px, 12px horizontal / 8px vertical padding, 12px radius. Whisper-soft shadow stack. White hover invert or subtle darken. Used for "Get started" and similar conversion moments.

### Outlined Secondary Button
**Role:** Companion action — same row, lower weight

Transparent background, 1px #eaebee border (darker on hover, ~#999999), #000000 text, Figtree 500, 12px radius, same padding as primary. The pairing of filled + outlined on the same row is the signature CTA pattern.

### Ghost Nav Link
**Role:** Top navigation items and in-content links

Transparent background, #3d3d3d text at 14px Figtree 500, no underline, 8px hover background wash. Dropdowns indicated by chevron, no decoration.

### Design Kit Card
**Role:** Gallery tile in the design kit grid (4-column layout)

#ffffff surface, 8px radius, full-bleed colorful product mockup image filling the card body, 16–20px padding below image for title block. Title in Figtree 600 at 16px Obsidian, category label in 13px Slate. No visible border, relies on the 1px shadow for separation from the Paper canvas.

### Product Showcase Frame
**Role:** Large framed mockup in the product section

#ffffff card containing device-frame mockups at full width, 18px radius on outer container, landscape gradient backdrop (#7cb86a green/grass) visible behind the cards. Internal UI cards use 12–18px radius.

### Floating Feature Card
**Role:** Callout card floating over hero or product imagery

#ffffff surface, 12–18px radius, soft drop shadow, small device thumbnail on the left (40–60px), title at Figtree 600 16px Obsidian, description at Figtree 400 13–14px Slate. Sits offset from its parent, creating the layered look.

### Top Navigation Bar
**Role:** Persistent site header

White/transparent background flush with the page canvas, no bottom border, 64–72px tall. Logo (colorful Iris Sweep gradient mark + Obsidian wordmark) on the left, horizontal nav items centered, "Log in" ghost link + filled "Get started" button on the right. 8px radius on the CTA button.

### Section Divider
**Role:** Vertical separation between content sections

No visible rule — sections are separated by ~80px of whitespace on the Paper canvas. Occasionally a 1px #eaebee hairline marks a transition.

### Decorative Icon Scatter
**Role:** Atmospheric floating icons in the hero margins

Small (24–40px) flat colorful icons positioned absolutely around the hero. Each rendered in a single brand-adjacent color (pinks, purples, blues, greens, oranges). No animation implied, but placement feels intentionally asymmetric — they exist to soften the otherwise empty white space.

## Do's and Don'ts

### Do
- Use Figtree for everything — no secondary font family, no system fallbacks in production output
- Let the page background be #faf8fd, never pure #ffffff, so cards visibly lift
- Pair a Filled Primary Button (Carbon #121212) with an Outlined Secondary Button (Mist border) in the same action row
- Reserve 8px radius for cards and nav, 12px for buttons, 18px only for prominent product frames
- Keep shadows to the signature two-layer stack: 1px hairline dark + 2–4px soft blur
- Use the Iris Sweep gradient only on the wordmark and brand-identity surfaces — never on buttons or functional UI
- Let product mockups and design kit thumbnails carry all the color; keep chrome grayscale

### Don't
- Don't introduce a chromatic CTA color — the primary action is always Carbon #121212
- Don't use heavy drop shadows or colored shadows; elevation must stay hairline
- Don't set body type below 13px or use Figtree below weight 400
- Don't add gradient backgrounds to UI surfaces; gradients belong to the logo and decorative imagery
- Don't center-align body paragraphs — the system uses left-aligned running text below the hero
- Don't use #0000ee or browser-default link blue for any interactive element
- Don't round buttons to pill (9999px); the system uses 8/12/18px radii only

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Canvas | `#faf8fd` | Page background — warm-white with a whisper of lavender so cards float above rather than blending in |
| 1 | Card | `#ffffff` | Elevated card surface for product mockup frames, design kit thumbnails, feature tiles |
| 2 | Panel | `#f9f9fa` | Subtle raised panels and secondary containers |
| 3 | Cool Wash | `#cfe7ed` | Soft cool-tinted highlight surface for featured callouts |

## Elevation

- **Primary button:** `rgba(0, 0, 0, 0.04) 0px 2px 4px 0px, rgba(0, 0, 0, 0.3) 0px 0px 1px 0px`
- **Secondary outlined button:** `rgba(0, 0, 0, 0.1) 0px 1px 1px 0px, rgba(0, 0, 0, 0.4) 0px 0px 1px 0px`

## Imagery

Imagery is the only source of color in this system. The product showcase uses full-width landscape photography (green grass field with wildflowers) as a backdrop for floating device-frame mockups. The design kit gallery is a 4-column grid of vibrant product screenshots — Apple CarPlay, Material 3, HarmonyOS, iPadOS, 3D avatar sets, fitness apps, finance apps — each thumbnail a different vivid color story. The hero is decorated with small flat icons (24–40px) in pink, purple, blue, green, and orange scattered asymmetrically around the white space. No photography of people, no lifestyle imagery, no abstract 3D renders — it's all real product work presented as visual evidence. Icon style is flat, single-color, geometric, with a slight chunky quality that matches Figtree's character.

## Layout

Full-bleed page structure with a 1200px max-width content rail. The hero is centered: oversized headline (48–60px, Figtree 700, tight 1.10 line-height) over a 16–18px subtitle, then a horizontally paired button row, then a floating product card. Product showcase sections use a 4-up row of device-frame mockups over a landscape photo background, framed by a 1200px container. The design kit gallery is a strict 4-column grid with 20px gaps, equal-height cards. Navigation is a flat 64–72px top bar, transparent over the canvas, with the logo left, links center, and CTA right. Section rhythm is generous — 80px vertical gaps between major sections on the Paper canvas, with no alternating dark/light bands. Everything is left-aligned or center-aligned; there are no asymmetric or magazine-style compositions.

## Agent Prompt Guide

## Quick Color Reference
- Page background: #faf8fd (Paper)
- Card surface: #ffffff
- Border / divider: #eaebee (Mist)
- Primary text: #000000 (Obsidian)
- Muted text: #666666 (Slate)
- Brand accent: #ee7cff → #4e6fff → #559cff (Iris Sweep gradient — logo only)
- primary action: no distinct CTA color

## Example Component Prompts
1. **Hero Headline + Action Row**: Center a 56px Figtree 700 headline in #000000 with 1.15 line-height. Below, place a Carbon #121212 filled button (Figtree 500 14px, #ffffff text, 12px radius, 12px 24px padding) next to an outlined button (1px #eaebee border, #000000 text, same padding and radius). Page background #faf8fd.

2. **Design Kit Gallery Card**: 4-column grid with 20px gap. Each card: #ffffff surface, 8px radius, full-bleed colorful product screenshot filling the body, 16px padding below for a Figtree 600 16px #000000 title and Figtree 400 13px #666666 category label. No border, rely on the whisper shadow.

3. **Floating Feature Callout**: #ffffff card with 12px radius and the standard two-layer shadow, ~60px device thumbnail on the left, Figtree 600 16px #000000 title and Figtree 400 14px #666666 description to its right. Sits offset 24px from its parent container.

4. **Section Divider (no rule)**: No visible line. Just 80px of #faf8fd background between content blocks, with a 1px #eaebee hairline only if marking a list or table boundary.

5. **Top Navigation**: 64px tall, transparent over #faf8fd. Left: Iris Sweep gradient mark + Obsidian wordmark. Center: Figtree 500 14px #3d3d3d nav links with 8px hover wash. Right: ghost "Log in" text link + Carbon #121212 filled "Get started" button (Figtree 500 14px, #ffffff, 8px radius, 8px 16px padding).

## Similar Brands

- **Figma** — Same near-monochrome marketing canvas with a single-color brand gradient, and design kit gallery rows of colorful product thumbnails doing the visual work
- **Framer** — Same quiet off-white page with oversized centered headlines, paired filled + outlined CTA buttons, and product mockups as the primary color source
- **Notion** — Same restrained neutral palette and hairline-border card aesthetic, letting user content and screenshots supply all the color
- **Linear** — Same single-family geometric sans (Figtree/Inter) carrying the entire voice and same near-black filled button as the only foreground accent

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-obsidian: #000000;
  --color-carbon: #121212;
  --color-graphite: #333333;
  --color-slate: #666666;
  --color-ash: #808080;
  --color-fog: #999999;
  --color-pebble: #8b8c8f;
  --color-smoke: #4d4d4d;
  --color-charcoal-veil: #3d3d3d;
  --color-dusk: #292929;
  --color-paper: #faf8fd;
  --color-bone: #f9f9fa;
  --color-mist: #eaebee;
  --color-ice-wash: #cfe7ed;
  --color-iris-sweep: #4e6fff;
  --gradient-iris-sweep: linear-gradient(88deg, #ee7cff 1.37%, #4e6fff 45.72%, #559cff 106.06%);
  --color-orchid-edge: #ee7cff;
  --color-sky-drift: #559cff;

  /* Typography — Font Families */
  --font-figtree: 'Figtree', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.5;
  --text-body: 14px;
  --leading-body: 1.6;
  --text-body-lg: 16px;
  --leading-body-lg: 1.55;
  --text-subheading: 18px;
  --leading-subheading: 1.5;
  --text-heading-sm: 24px;
  --leading-heading-sm: 1.3;
  --text-heading: 30px;
  --leading-heading: 1.21;
  --text-heading-lg: 34px;
  --leading-heading-lg: 1.21;
  --text-display: 48px;
  --leading-display: 1.17;
  --text-display-lg: 60px;
  --leading-display-lg: 1.1;

  /* Typography — Weights */
  --font-weight-regular: 400;
  --font-weight-medium: 500;
  --font-weight-semibold: 600;
  --font-weight-bold: 700;

  /* Spacing */
  --spacing-4: 4px;
  --spacing-5: 5px;
  --spacing-6: 6px;
  --spacing-7: 7px;
  --spacing-8: 8px;
  --spacing-10: 10px;
  --spacing-12: 12px;
  --spacing-14: 14px;
  --spacing-16: 16px;
  --spacing-17: 17px;
  --spacing-18: 18px;
  --spacing-20: 20px;
  --spacing-26: 26px;
  --spacing-30: 30px;
  --spacing-32: 32px;
  --spacing-50: 50px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 80px;
  --card-padding: 20px;
  --element-gap: 10px;

  /* Border Radius */
  --radius-lg: 8px;
  --radius-xl: 12px;
  --radius-2xl: 18px;
  --radius-3xl: 25px;

  /* Named Radii */
  --radius-nav: 8px;
  --radius-cards: 8px;
  --radius-inputs: 8px;
  --radius-buttons: 12px;
  --radius-buttons-prominent: 18px;

  /* Shadows */
  --shadow-sm: rgba(0, 0, 0, 0.04) 0px 2px 4px 0px, rgba(0, 0, 0, 0.3) 0px 0px 1px 0px;
  --shadow-subtle: rgba(0, 0, 0, 0.1) 0px 1px 1px 0px, rgba(0, 0, 0, 0.4) 0px 0px 1px 0px;

  /* Surfaces */
  --surface-canvas: #faf8fd;
  --surface-card: #ffffff;
  --surface-panel: #f9f9fa;
  --surface-cool-wash: #cfe7ed;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-obsidian: #000000;
  --color-carbon: #121212;
  --color-graphite: #333333;
  --color-slate: #666666;
  --color-ash: #808080;
  --color-fog: #999999;
  --color-pebble: #8b8c8f;
  --color-smoke: #4d4d4d;
  --color-charcoal-veil: #3d3d3d;
  --color-dusk: #292929;
  --color-paper: #faf8fd;
  --color-bone: #f9f9fa;
  --color-mist: #eaebee;
  --color-ice-wash: #cfe7ed;
  --color-iris-sweep: #4e6fff;
  --color-orchid-edge: #ee7cff;
  --color-sky-drift: #559cff;

  /* Typography */
  --font-figtree: 'Figtree', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.5;
  --text-body: 14px;
  --leading-body: 1.6;
  --text-body-lg: 16px;
  --leading-body-lg: 1.55;
  --text-subheading: 18px;
  --leading-subheading: 1.5;
  --text-heading-sm: 24px;
  --leading-heading-sm: 1.3;
  --text-heading: 30px;
  --leading-heading: 1.21;
  --text-heading-lg: 34px;
  --leading-heading-lg: 1.21;
  --text-display: 48px;
  --leading-display: 1.17;
  --text-display-lg: 60px;
  --leading-display-lg: 1.1;

  /* Spacing */
  --spacing-4: 4px;
  --spacing-5: 5px;
  --spacing-6: 6px;
  --spacing-7: 7px;
  --spacing-8: 8px;
  --spacing-10: 10px;
  --spacing-12: 12px;
  --spacing-14: 14px;
  --spacing-16: 16px;
  --spacing-17: 17px;
  --spacing-18: 18px;
  --spacing-20: 20px;
  --spacing-26: 26px;
  --spacing-30: 30px;
  --spacing-32: 32px;
  --spacing-50: 50px;

  /* Border Radius */
  --radius-lg: 8px;
  --radius-xl: 12px;
  --radius-2xl: 18px;
  --radius-3xl: 25px;

  /* Shadows */
  --shadow-sm: rgba(0, 0, 0, 0.04) 0px 2px 4px 0px, rgba(0, 0, 0, 0.3) 0px 0px 1px 0px;
  --shadow-subtle: rgba(0, 0, 0, 0.1) 0px 1px 1px 0px, rgba(0, 0, 0, 0.4) 0px 0px 1px 0px;
}
```
