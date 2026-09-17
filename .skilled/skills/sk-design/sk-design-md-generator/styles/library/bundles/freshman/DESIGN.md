# Freshman — Style Reference
> cinema title card on black velvet

**Theme:** dark

Freshman runs a near-black canvas with almost no color noise — the white type and the lone red accent do all the heavy lifting. The visual language borrows from high-end print and cinema: a massive italicized wordmark anchors every screen, type is set ultra-light (weight 200) in Editorial New and tight in Altform, and a thin horizontal project ticker acts as the page's spine. Surfaces are flat with no shadows or gradients; hierarchy comes from scale and weight contrast, not elevation. Interaction is restrained — a single + MENU trigger, bracket-wrapped editorial labels, and a project reel that feels like a film festival credit roll rather than a SaaS nav.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Pure White | `#ffffff` | `--color-pure-white` | Primary text, logotype fill, border strokes, and the dominant foreground on the dark canvas — carries 92% of all color instances |
| Carbon Black | `#000000` | `--color-carbon-black` | Base canvas and primary background — the default surface for every page |
| Charcoal Shale | `#101010` | `--color-charcoal-shale` | Secondary surface for icon wells, sub-panels, and slight tonal lift above the pure-black canvas |
| Signal Red | `#ff2936` | `--color-signal-red` | Sparingly-applied accent for active states, marquee highlights, and high-emphasis punctuation — used as a single saturated note against the monochrome system |

## Tokens — Typography

### Editorial New — Hero and headline display — the ultralight weight 200 is anti-convention; combined with the 20px breakpoint it reads as editorial print rather than web UI · `--font-editorial-new`
- **Substitute:** Cormorant Garamond, Playfair Display
- **Weights:** 200
- **Sizes:** 16px, 20px
- **Line height:** 1.00, 1.25
- **Letter spacing:** -0.01em
- **Role:** Hero and headline display — the ultralight weight 200 is anti-convention; combined with the 20px breakpoint it reads as editorial print rather than web UI

### TT Firs Neue — Workhorse UI and body sans — the only geometric grotesque in the system, anchors the project ticker labels, menu trigger, and utility text · `--font-tt-firs-neue`
- **Substitute:** Inter, Neue Haas Grotesk, Söhne
- **Weights:** 400
- **Sizes:** 16px
- **Line height:** 1.00
- **Role:** Workhorse UI and body sans — the only geometric grotesque in the system, anchors the project ticker labels, menu trigger, and utility text

### Altform — Compact meta and condensed labels — tight 0.86–0.88 line-height and -0.03em tracking make it read like a festival credit roll · `--font-altform`
- **Substitute:** Druk, Tungsten, Bebas Neue
- **Weights:** 400, 700
- **Sizes:** 14px, 16px
- **Line height:** 0.86, 0.88
- **Letter spacing:** -0.03em
- **Role:** Compact meta and condensed labels — tight 0.86–0.88 line-height and -0.03em tracking make it read like a festival credit roll

### Wasted Year — Signature editorial flourishes — bracket-wrapped taglines and small accent phrases; its hand-set quality is used for personality, not information density · `--font-wasted-year`
- **Substitute:** Caveat, Reenie Beanie
- **Weights:** 400
- **Sizes:** 12px, 14px, 17px, 20px
- **Line height:** 0.86, 0.94, 1.00, 1.25
- **Letter spacing:** -0.0100em
- **Role:** Signature editorial flourishes — bracket-wrapped taglines and small accent phrases; its hand-set quality is used for personality, not information density

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 12px | 1 | — | `--text-caption` |
| body-sm | 14px | 1 | — | `--text-body-sm` |
| body | 17px | 1 | — | `--text-body` |
| body-lg | 20px | 1 | — | `--text-body-lg` |

## Tokens — Spacing & Shapes

**Base unit:** 4px

**Density:** compact

### Spacing Scale

| Name | Value | Token |
|------|-------|-------|
| 4 | 4px | `--spacing-4` |
| 5 | 5px | `--spacing-5` |
| 7 | 7px | `--spacing-7` |
| 8 | 8px | `--spacing-8` |
| 12 | 12px | `--spacing-12` |
| 20 | 20px | `--spacing-20` |

### Border Radius

| Element | Value |
|---------|-------|
| tags | 0px |
| cards | 0px |
| inputs | 0px |
| buttons | 0px |

### Layout

- **Section gap:** 48-80px
- **Card padding:** 12-20px
- **Element gap:** 12px

## Components

### Hero Wordmark
**Role:** Brand identity anchor — the primary visual element on the dark canvas

Full-bleed 'freshman' logotype, set ultra-large in italic Editorial New weight 200, white (#ffffff) fill on Carbon Black (#000000). Letter-spacing -0.01em. A small registered-trademark ® sits at the upper-right of the mark. No background, no border, no shadow — the wordmark is the only object on screen.

### Project Reel Ticker
**Role:** Persistent bottom band showcasing latest work like a film festival credit roll

Full-bleed horizontal bar anchored to the viewport bottom. Pure Black (#000000) background with a 1px top hairline in White (#ffffff). Items arranged in a single row with 12px column gaps; each item pairs a small thumbnail (Altform, condensed, weight 700) with a project title (TT Firs Neue, 14-16px, weight 400) and a secondary label (TT Firs Neue, 12px, 0.86 line-height, uppercase). 20px vertical padding, zero radius.

### Menu Trigger
**Role:** Primary navigation entry point

Top-right 'MENU' label prefixed by a + glyph, set in TT Firs Neue 16px weight 400 in White (#ffffff). No background, no border — a bare typographic control. Inherits the 'all type, no chrome' philosophy of the system.

### Brand Glyph
**Role:** Persistent mark in the upper-left corner

A small hash/cross-like symbol in White (#ffffff) on the Black canvas. Sits at the same cap height as the MENU trigger, anchoring the top bar in quiet symmetry. Likely set in TT Firs Neue or a custom icon font, ~16px.

### Year Counter
**Role:** Cinematic page-position indicator

Centered '2025' string set in Altform weight 400 at 14px with 0.88 line-height and -0.03em tracking in White (#ffffff). Reads as a chapter marker; updates per scroll position to mimic a film leader countdown.

### Editorial Tagline Block
**Role:** Voice/mission statement with typographic personality

Two stacked lines of body text in TT Firs Neue 16px weight 400, White (#ffffff), centered, max-width ~600px. Followed by a bracket-wrapped Wasted Year phrase at 14–17px — the handwritten font transforms the tagline into a signed autograph.

### Cookie Consent Strip
**Role:** Bottom-right regulatory notice

Minimal pill-less bar in Charcoal Shale (#101010) with 1px White (#ffffff) hairline border, ~12px text in TT Firs Neue, uppercase tracking. Rounded zero. Sits flush to the viewport edge, never centered — treated as utility, not design.

### Project Item Cell
**Role:** Individual entry inside the project reel

Three-line vertical stack: uppercase project name (TT Firs Neue 16px, weight 400, White), short sub-label (TT Firs Neue 12px, Altform 0.88 line-height, White at ~70% perceived opacity), and optional thumbnail to the left at ~80px tall. No border, no background tile — text sits directly on the Black bar.

### Thin Hairline Divider
**Role:** Section separator — the only structural chrome in the system

1px horizontal line in White (#ffffff) at 70-100% opacity. Used between the hero and ticker, and between any stacked zones. Zero radius, zero shadow.

## Do's and Don'ts

### Do
- Set the wordmark at 200 weight italic in Editorial New — never bold, never regular; the ultralight is the signature
- Use only #ffffff text on #000000 canvas; treat the 1px white hairline as the only structural divider allowed
- Anchor the project reel to the viewport bottom on every page — it functions as the site's navigation spine
- Pair the body description (TT Firs Neue 16px) with a bracket-wrapped Wasted Year tagline directly beneath it; the handwriting-font punctuation is non-optional
- Use #ff2936 for at most one element per viewport — it is punctuation, not paint
- Set compact UI labels (reel items, counters) in Altform with 0.86-0.88 line-height and -0.03em tracking for the festival-credit-roll rhythm
- Keep the MENU trigger as a bare typographic label — no border, no background, no icon button chrome

### Don't
- Do not introduce shadows, gradients, or elevation of any kind — flatness is the system
- Do not add card backgrounds or rounded corners; all surfaces are 0px radius on the black canvas
- Do not use bold or semibold weights for headlines — the weight 200 Editorial New is the anti-convention that defines the brand
- Do not use #ff2936 as a button fill or large background block — it loses all impact if used at scale
- Do not add a secondary navigation, breadcrumbs, or page tabs — the MENU trigger and the reel are the entire IA
- Do not set body copy above 16px or below 14px — the type scale is deliberately tight
- Do not alternate between light and dark sections; the page is uniformly dark, depth comes from type scale not surface color

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 1 | Carbon Black | `#000000` | Primary page canvas — the dominant surface covering the viewport |
| 2 | Charcoal Shale | `#101010` | Subtle elevation for utility elements like the cookie consent bar; barely perceptible shift above the canvas |

## Elevation

The system intentionally avoids shadows and gradients. Depth is communicated exclusively through type scale, weight contrast, and the two-step surface stack (#000000 → #101010). This is a deliberate editorial-print decision — shadows would make the screen feel like software; flatness makes it feel like cinema.

## Imagery

Imagery is almost absent from the main canvas. Photography appears only as small horizontal thumbnails inside the project reel ticker — tight, cinematic crops around 80px tall with no rounded corners and no overlay treatments. The visual identity is driven entirely by the oversized italic wordmark, ultra-light editorial type, and the vertical rhythm of bracketed handwritten flourishes. No illustration, no 3D, no decorative gradients — the wordmark IS the imagery.

## Agent Prompt Guide

**Quick Color Reference**
- canvas/background: #000000
- primary text: #ffffff
- secondary surface: #101010
- hairline border: #ffffff (1px)
- accent / active state: #ff2936
- primary action: no distinct CTA color

**3-5 Example Component Prompts**

1. *Hero wordmark screen*: full-viewport Carbon Black (#000000) background. Center a single italic 'freshman' logotype in Editorial New weight 200, white (#ffffff), sized to fill ~60% of the viewport width, letter-spacing -0.01em. Below it, a two-line description in TT Firs Neue 16px weight 400 white, centered, max-width 600px. Beneath that, a bracket-wrapped tagline in Wasted Year 14px white.

2. *Project reel ticker*: pinned bar at the viewport bottom, Carbon Black (#000000) background, 1px white (#ffffff) top border. Single row of project items, 12px column gaps, 20px vertical padding. Each item = uppercase project name (TT Firs Neue 16px weight 400 white) stacked over a sub-label (TT Firs Neue 12px, line-height 0.88, white at 70% perceived opacity). Zero radius on all elements.

3. *Year counter*: centered horizontally, positioned in the lower third of the viewport. Set '2025' in Altform 14px weight 400 white, line-height 0.88, letter-spacing -0.03em. No background, no border.

4. *Top navigation bar*: full-width, Carbon Black background, 20px vertical padding. Left: a small 16px white hash/cross glyph. Right: '+ MENU' in TT Firs Neue 16px weight 400 white. No borders, no background fills, no separators between left and right.

5. *Cookie consent strip*: bottom-right corner, Charcoal Shale (#101010) background, 1px white (#ffffff) border, 12px text in TT Firs Neue weight 400, uppercase, white. ~12px padding. Zero radius. Flush to the viewport edge, never centered.

## Similar Brands

- **Hypebeast** — Same editorial-meets-streetwear sensibility with oversized italic wordmarks on a near-black canvas and a ticker-like feed of content at the bottom
- **A24 Films** — Cinema-title-card aesthetic — white type on pure black, ultralight editorial headlines, minimal chrome, and the feeling that the brand IS the logotype
- **Bureau Cool** — Indie creative agencies that use editorial type, custom serifs at weight 200, and near-zero decoration; both treat the homepage as a statement rather than a product page
- **Buck (studio)** — Production/creative studios with full-bleed dark canvases, restrained type, and project reels that double as the primary navigation rhythm

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-pure-white: #ffffff;
  --color-carbon-black: #000000;
  --color-charcoal-shale: #101010;
  --color-signal-red: #ff2936;

  /* Typography — Font Families */
  --font-editorial-new: 'Editorial New', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-tt-firs-neue: 'TT Firs Neue', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-altform: 'Altform', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-wasted-year: 'Wasted Year', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1;
  --text-body-sm: 14px;
  --leading-body-sm: 1;
  --text-body: 17px;
  --leading-body: 1;
  --text-body-lg: 20px;
  --leading-body-lg: 1;

  /* Typography — Weights */
  --font-weight-extralight: 200;
  --font-weight-regular: 400;
  --font-weight-bold: 700;

  /* Spacing */
  --spacing-unit: 4px;
  --spacing-4: 4px;
  --spacing-5: 5px;
  --spacing-7: 7px;
  --spacing-8: 8px;
  --spacing-12: 12px;
  --spacing-20: 20px;

  /* Layout */
  --section-gap: 48-80px;
  --card-padding: 12-20px;
  --element-gap: 12px;

  /* Named Radii */
  --radius-tags: 0px;
  --radius-cards: 0px;
  --radius-inputs: 0px;
  --radius-buttons: 0px;

  /* Surfaces */
  --surface-carbon-black: #000000;
  --surface-charcoal-shale: #101010;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-pure-white: #ffffff;
  --color-carbon-black: #000000;
  --color-charcoal-shale: #101010;
  --color-signal-red: #ff2936;

  /* Typography */
  --font-editorial-new: 'Editorial New', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-tt-firs-neue: 'TT Firs Neue', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-altform: 'Altform', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-wasted-year: 'Wasted Year', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1;
  --text-body-sm: 14px;
  --leading-body-sm: 1;
  --text-body: 17px;
  --leading-body: 1;
  --text-body-lg: 20px;
  --leading-body-lg: 1;

  /* Spacing */
  --spacing-4: 4px;
  --spacing-5: 5px;
  --spacing-7: 7px;
  --spacing-8: 8px;
  --spacing-12: 12px;
  --spacing-20: 20px;
}
```
