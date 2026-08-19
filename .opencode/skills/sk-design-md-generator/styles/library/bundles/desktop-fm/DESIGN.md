# Desktop.fm — Style Reference
> Chrome disc in a laser grid — Apple keynote restraint meets cyberpunk CD-ROM nostalgia.

**Theme:** light

Desktop.fm is a near-monochrome product page that treats a single 3D-rendered object as the entire hero. The canvas is a cold light gray, the chrome disc floats centered, and the interface furniture is reduced to a single macOS-style window card with one black button. Typography is aggressive: system fonts pushed to weights 700-800 with tight tracking, never thin or light. The page is 1% chromatic by design — the only color comes from the rendered scene (neon green laser lines across a silver CD), and that color is not part of the UI token system, it is the product. Components are compact, radii are mostly sharp (1.5px), and the only soft radius belongs to the app-window card itself (25px) and the pill-lozenge button (20px). The result reads as an Apple product page filtered through a cyberpunk CD-ROM era — restrained chrome surfaces, one bold interactive element, and atmosphere carried entirely by a 3D asset rather than by gradient or illustration.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Canvas Mist | `#f1f2f3` | `--color-canvas-mist` | Page background, dominant surface across hero and surrounding space |
| Carbon Black | `#111111` | `--color-carbon-black` | Dark supporting neutral for text, icons, and strong contrast. Do not promote it to the primary CTA color |
| Pure White | `#ffffff` | `--color-pure-white` | Elevated card surface (app window mockup), inverse text on dark buttons |
| Graphite | `#2d2d2d` | `--color-graphite` | Secondary dark surfaces, icon strokes, muted dark UI elements |
| Pale Stone | `#dddddd` | `--color-pale-stone` | Hairline borders, dividers, secondary card backgrounds |
| Silver Mist | `#b4b4b4` | `--color-silver-mist` | Muted backgrounds, disabled states, low-emphasis surfaces |

## Tokens — Typography

### -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif — Primary interface typeface — used for everything from the 28px bold brand wordmark to the 12px 800-weight button label and meta tags. The exclusive use of weights 700 and 800 (plus 500 for the smallest tag) is the signature: no thin or regular weights appear anywhere. Combined with -0.036em tracking on the 28px size, headlines feel mechanically precise rather than elegant. · `--font-apple-system-blinkmacsystemfont-segoe-ui-system-ui-sans-serif`
- **Substitute:** Inter (weights 500, 700, 800) or SF Pro Display
- **Weights:** 500, 700, 800
- **Sizes:** 12px, 16px, 18px, 28px
- **Line height:** 1.25
- **Letter spacing:** -0.036em (28px headlines), -0.016em (16-18px body and subhead), normal (12px caption)
- **Role:** Primary interface typeface — used for everything from the 28px bold brand wordmark to the 12px 800-weight button label and meta tags. The exclusive use of weights 700 and 800 (plus 500 for the smallest tag) is the signature: no thin or regular weights appear anywhere. Combined with -0.036em tracking on the 28px size, headlines feel mechanically precise rather than elegant.

### ui-monospace, 'SF Mono', Menlo, monospace — Reserved for single-character or ultra-short technical labels (e.g. the leading icon glyph in the waiting-list card). Monospace at weight 800 at 12px reads as a stamped serial number rather than body text. · `--font-ui-monospace-sf-mono-menlo-monospace`
- **Substitute:** JetBrains Mono or IBM Plex Mono at weight 800
- **Weights:** 800
- **Sizes:** 12px
- **Line height:** 1.25
- **Letter spacing:** normal
- **Role:** Reserved for single-character or ultra-short technical labels (e.g. the leading icon glyph in the waiting-list card). Monospace at weight 800 at 12px reads as a stamped serial number rather than body text.

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 12px | 1.25 | — | `--text-caption` |
| body-sm | 16px | 1.25 | -0.256px | `--text-body-sm` |
| body | 18px | 1.25 | -0.288px | `--text-body` |
| heading | 28px | 1.25 | -1.008px | `--text-heading` |

## Tokens — Spacing & Shapes

**Density:** compact

### Spacing Scale

| Name | Value | Token |
|------|-------|-------|
| 5 | 5px | `--spacing-5` |
| 8 | 8px | `--spacing-8` |
| 10 | 10px | `--spacing-10` |
| 20 | 20px | `--spacing-20` |
| 30 | 30px | `--spacing-30` |

### Border Radius

| Element | Value |
|---------|-------|
| cards | 25px |
| buttons | 20px |
| default | 1.5px |
| window-chrome | 13px |

### Layout

- **Section gap:** 30px
- **Card padding:** 10px
- **Element gap:** 8px

## Components

### App Window Card
**Role:** The single elevated container on the page — a macOS-style window mockup that frames the brand name and CTA

White (#ffffff) surface on the Canvas Mist (#f1f2f3) page. 25px border-radius (the largest radius in the system). 10px internal padding. Contains a title bar with three traffic-light dots (using #b4b4b4 and #2d2d2d) and a 2px title-bar separator. Houses the 28px 800-weight brand wordmark centered above the CTA. Subtle drop shadow provides the only elevation on the page.

### Filled Primary Button
**Role:** The sole interactive element — a high-contrast CTA

Background #111111 (Carbon Black), text #ffffff at 12px weight 800. 20px border-radius creates a lozenge/pill profile. 10px vertical padding with 20px horizontal padding. Includes a trailing chevron (›) glyph at 12px 800 weight as an affordance cue. No hover state differentiation visible — the button is already at maximum contrast against the white card.

### Traffic Light Window Controls
**Role:** Decorative macOS chrome elements signaling 'this is an app'

Three small circular indicators in the window title bar at approximately 2px size. Mixed #b4b4b4 (muted/close) and #2d2d2d (graphite/minimize-maximize) fills. 1.5px radius (effectively circles at that size). Purely decorative — not interactive.

### Brand Wordmark
**Role:** The only headline-scale text element on the page

'Desktop.fm' rendered at 28px, weight 800, color #111111. Letter-spacing -0.036em. Centered within the app window card. No subtitle, tagline, or supporting copy — the wordmark stands alone between the window controls and the CTA.

### Hero Render Stage
**Role:** The full-bleed visual container that holds the 3D disc and laser scene

Takes the full viewport. Background is #f1f2f3 (no separate color — the page canvas IS the stage). The 3D chrome disc and neon green laser lines are a single rendered asset, not CSS elements. Vertically centered disc with the app window card anchored below it at approximately 30px margin-top from the disc's bottom edge.

### Chevron Affordance Glyph
**Role:** Trailing icon inside the primary button indicating forward action

Single › character at 12px weight 800 in #ffffff. Sits at the right edge of the filled button with 2-5px gap from the label. Uses the system font's heavy weight to render as a solid triangle rather than a thin stroke.

## Do's and Don'ts

### Do
- Use #111111 as the only filled button background — the entire page has one CTA and it must be Carbon Black
- Set all headlines at 28px with weight 800 and letter-spacing -1.008px (-0.036em)
- Use 25px border-radius exclusively for the app-window card, and 20px for the button — keep the rest of the UI at 1.5px
- Let the 3D render be the only source of color on the page — the UI stays strictly achromatic
- Anchor the window card below the rendered hero with 30px vertical margin
- Use system font stack at weights 700-800 for all interface text; never drop below weight 500
- Keep line-height locked at 1.25 across every text size

### Don't
- Don't introduce chromatic colors as UI tokens — the only color belongs to the rendered scene
- Don't use border-radius above 25px or below 1.5px — the system is binary: sharp or lozenge
- Don't use font weights below 500 anywhere — thin and regular weights break the mechanical, stamped feel
- Don't add multiple CTAs or secondary buttons — this page has exactly one black filled button
- Don't add visible borders to the window card — rely on the 25px radius and subtle shadow for definition
- Don't use a max-width container — the layout is centered but unconstrained, the render fills the viewport
- Don't substitute the 3D render with an illustration, gradient, or flat graphic — the chrome disc and laser grid IS the brand

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Page Canvas | `#f1f2f3` | Dominant background for the entire viewport — the cool light gray stage on which the disc floats |
| 1 | App Window Surface | `#ffffff` | Elevated white card containing the brand name and CTA — the only surface above the canvas |
| 2 | Primary Action | `#111111` | Black button surface — sits on top of the white card, creating the page's only stacked contrast moment |

## Elevation

- **App Window Card:** `0 1px 3px rgba(17,17,17,0.08), 0 4px 12px rgba(17,17,17,0.06)`

## Imagery

The page carries exactly one visual: a 3D-rendered chrome CD floating at slight tilt, intersected by two thin neon-green laser lines that cross diagonally through the scene. The disc has realistic specular highlights — blue-white reflections on the left edge, warm reflections on the right — and a dark center hub. This is a single rendered asset, not an interactive 3D scene visible in the data. There is no photography, no illustration, no product screenshot. The render is full-bleed, centered, and occupies roughly 60% of the viewport height. Below it, the app window card serves as the only UI visual. The treatment is high-key and product-showcase oriented — the object is the hero, presented with the detached reverence of an Apple product launch.

## Layout

Full-bleed single-screen layout with no scrollable sections visible. The viewport is divided vertically: the upper ~70% is the hero render zone (3D disc and laser grid centered horizontally, floating in the gray canvas with generous negative space on all sides), and the lower ~30% contains the app window card centered horizontally. The card is narrow (roughly 200px wide) and uses no max-width constraint on the page itself — the layout is centered but unconstrained. Navigation is absent — this is a teaser/coming-soon page with a single CTA. The vertical rhythm is: render (60vh) → 30px gap → window card (~80px tall) → remaining canvas below. No alternating bands, no grid systems, no multi-column arrangements.

## Agent Prompt Guide

Quick Color Reference:
- canvas: #f1f2f3
- card surface: #ffffff
- primary text: #111111
- border/divider: #dddddd
- muted surface: #b4b4b4
- primary action: no distinct CTA color

Example Component Prompts:

1. Create a hero stage: full-bleed #f1f2f3 background, centered 3D chrome disc asset with two thin neon-green diagonal laser lines crossing through it. Disc positioned in the upper 70% of the viewport. Below the disc, a 30px gap, then a white app-window card centered horizontally.

2. Create an app window card: 25px border-radius, #ffffff surface, 10px padding all sides, subtle soft shadow (0 1px 3px rgba(17,17,17,0.08), 0 4px 12px rgba(17,17,17,0.06)). Title bar at top with three small circular traffic-light dots in #b4b4b4 and #2d2d2d, separated from the body by a 2px #dddddd hairline divider.

No distinct primary action color was observed; use the extracted neutral button treatments instead of inventing a filled CTA color.

4. Create a brand wordmark: 'Desktop.fm' at 28px, weight 800, color #111111, letter-spacing -0.036em (-1.008px), line-height 1.25, centered within the app window card body. No subtitle or supporting text.

5. Create a hairline divider: 2px height, #dddddd color, full-width within its container. Used only to separate the window title bar from the card body.

## Similar Brands

- **Apple product launch pages (macOS, Music app)** — Same macOS-window card pattern, system-font-only typography at heavy weights, and a single rendered object as the entire hero with achromatic UI surrounding it
- **Arc browser site (arc.net)** — Same restrained neutral palette, aggressive bold type at tight tracking, and a single hero visual that carries the entire page's atmosphere
- **Nothing.tech** — Same minimal monochrome product page with a single CTA and dot-matrix-style type aesthetic, though Nothing adds more chromatic accents
- **Rayo.fm or other music app teasers** — Same single-screen coming-soon format with one email-capture CTA and a hero render above it

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-canvas-mist: #f1f2f3;
  --color-carbon-black: #111111;
  --color-pure-white: #ffffff;
  --color-graphite: #2d2d2d;
  --color-pale-stone: #dddddd;
  --color-silver-mist: #b4b4b4;

  /* Typography — Font Families */
  --font-apple-system-blinkmacsystemfont-segoe-ui-system-ui-sans-serif: '-apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-ui-monospace-sf-mono-menlo-monospace: 'ui-monospace, 'SF Mono', Menlo, monospace', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.25;
  --text-body-sm: 16px;
  --leading-body-sm: 1.25;
  --tracking-body-sm: -0.256px;
  --text-body: 18px;
  --leading-body: 1.25;
  --tracking-body: -0.288px;
  --text-heading: 28px;
  --leading-heading: 1.25;
  --tracking-heading: -1.008px;

  /* Typography — Weights */
  --font-weight-medium: 500;
  --font-weight-bold: 700;
  --font-weight-extrabold: 800;

  /* Spacing */
  --spacing-5: 5px;
  --spacing-8: 8px;
  --spacing-10: 10px;
  --spacing-20: 20px;
  --spacing-30: 30px;

  /* Layout */
  --section-gap: 30px;
  --card-padding: 10px;
  --element-gap: 8px;

  /* Border Radius */
  --radius-sm: 1.5px;
  --radius-xl: 13px;
  --radius-2xl: 20px;
  --radius-3xl: 25px;

  /* Named Radii */
  --radius-cards: 25px;
  --radius-buttons: 20px;
  --radius-default: 1.5px;
  --radius-window-chrome: 13px;

  /* Surfaces */
  --surface-page-canvas: #f1f2f3;
  --surface-app-window-surface: #ffffff;
  --surface-primary-action: #111111;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-canvas-mist: #f1f2f3;
  --color-carbon-black: #111111;
  --color-pure-white: #ffffff;
  --color-graphite: #2d2d2d;
  --color-pale-stone: #dddddd;
  --color-silver-mist: #b4b4b4;

  /* Typography */
  --font-apple-system-blinkmacsystemfont-segoe-ui-system-ui-sans-serif: '-apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-ui-monospace-sf-mono-menlo-monospace: 'ui-monospace, 'SF Mono', Menlo, monospace', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.25;
  --text-body-sm: 16px;
  --leading-body-sm: 1.25;
  --tracking-body-sm: -0.256px;
  --text-body: 18px;
  --leading-body: 1.25;
  --tracking-body: -0.288px;
  --text-heading: 28px;
  --leading-heading: 1.25;
  --tracking-heading: -1.008px;

  /* Spacing */
  --spacing-5: 5px;
  --spacing-8: 8px;
  --spacing-10: 10px;
  --spacing-20: 20px;
  --spacing-30: 30px;

  /* Border Radius */
  --radius-sm: 1.5px;
  --radius-xl: 13px;
  --radius-2xl: 20px;
  --radius-3xl: 25px;
}
```
