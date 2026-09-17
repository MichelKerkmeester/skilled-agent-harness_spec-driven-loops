# Prisma Labs — Style Reference
> Sunlit monochrome studio — a white gallery wall where one beam of yellow light hits

**Theme:** light

Prisma Labs runs a ruthlessly restrained visual system: pure white canvas, near-black type, and one vivid yellow as the only chromatic signal. Display headlines carry enormous weight (700) at near-1.0 line-height with tight negative tracking, reading like editorial type rather than typical SaaS hero copy. Yellow appears as functional punctuation — filled CTAs, active in-app controls, and as organic blob shapes bleeding behind phone mockups — never as decoration. The layout is split and alternating: text one side, oversized product mockup the other, with generous vertical breathing room (80–120px) between bands. Surfaces are flat; elevation is achieved through color contrast and blob backings rather than shadows.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Ink Black | `#0d0d0d` | `--color-ink-black` | Primary text, nav links, all borders, button outlines |
| Paper White | `#ffffff` | `--color-paper-white` | Page canvas, card surfaces, button text on yellow fill |
| Graphite | `#333333` | `--color-graphite` | Secondary text, image borders, link underlines, muted dividers |
| Signal Yellow | `#ffd600` | `--color-signal-yellow` | CTA button fill, in-app active tabs, decorative blob shapes behind mockups, active state highlights — the single chromatic accent that makes actions feel switched on |
| Alert Magenta | `#ff0062` | `--color-alert-magenta` | Red outline accent for tags, dividers, and focused UI edges |

## Tokens — Typography

### Cofo Sans — Display headlines at 72px weight 700 with extremely tight tracking read like editorial poster type — the weight does the work, not the size alone. Also used for nav links, button labels, and small caps text at 18–22px weight 600/700. The 700 weight is the signature: most sites use 500–600 for heroes, this goes maximum weight to create authority through volume rather than restraint. · `--font-cofo-sans`
- **Substitute:** Manrope or Outfit (geometric sans with similar weight range and tight tracking behavior)
- **Weights:** 400, 600, 700
- **Sizes:** 10px, 18px, 22px, 72px
- **Line height:** 1.00–1.11
- **Letter spacing:** -0.0070em
- **Role:** Display headlines at 72px weight 700 with extremely tight tracking read like editorial poster type — the weight does the work, not the size alone. Also used for nav links, button labels, and small caps text at 18–22px weight 600/700. The 700 weight is the signature: most sites use 500–600 for heroes, this goes maximum weight to create authority through volume rather than restraint.

### Arial — System fallback for body copy and secondary text at 14px — deliberately quiet, never competes with the Cofo Sans display moments · `--font-arial`
- **Substitute:** Helvetica or system-ui
- **Weights:** 400
- **Sizes:** 14px
- **Line height:** 1.43
- **Role:** System fallback for body copy and secondary text at 14px — deliberately quiet, never competes with the Cofo Sans display moments

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 10px | 1 | -0.07px | `--text-caption` |
| body | 14px | 1.43 | — | `--text-body` |
| subheading | 18px | 1.11 | -0.126px | `--text-subheading` |
| heading-sm | 22px | 1.1 | -0.154px | `--text-heading-sm` |
| display | 72px | 1 | -0.504px | `--text-display` |

## Tokens — Spacing & Shapes

**Base unit:** 4px

**Density:** comfortable

### Spacing Scale

| Name | Value | Token |
|------|-------|-------|
| 12 | 12px | `--spacing-12` |
| 16 | 16px | `--spacing-16` |
| 20 | 20px | `--spacing-20` |
| 24 | 24px | `--spacing-24` |
| 84 | 84px | `--spacing-84` |
| 120 | 120px | `--spacing-120` |
| 124 | 124px | `--spacing-124` |
| 136 | 136px | `--spacing-136` |
| 144 | 144px | `--spacing-144` |

### Border Radius

| Element | Value |
|---------|-------|
| blobs | irregular |
| cards | 10px |
| buttons | 16px |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 84-124px
- **Card padding:** 24-26px
- **Element gap:** 16-20px

## Components

### Primary CTA Button
**Role:** Filled yellow pill-shaped action button

#ffd600 fill, #0d0d0d text, 16px border-radius, padding 12px vertical × 16–26px horizontal, label in Cofo Sans 18–22px weight 700 with right-arrow glyph (→). Black-on-yellow achieves 13.8:1 contrast — readable, punchy, never soft. No hover state needed; the color does the signaling.

### Top Navigation Bar
**Role:** Minimal horizontal nav with logo left, links right

White background, no border. Logo lockup left ('PRISMA LABS' wordmark in Cofo Sans 14–18px weight 600 with small triangle icon). Nav links right in Cofo Sans 14–18px weight 600, #0d0d0d text, 20–24px gap between items. One item may carry a small #ff0062 notification dot (3–4px circle) to signal new content.

### Display Headline
**Role:** Editorial-style hero and section headings

Cofo Sans 72px weight 700, line-height 1.0, letter-spacing -0.504px (-0.007em), #0d0d0d. Tight tracking at this size prevents the letterforms from feeling loose; the near-1.0 line-height lets large multi-line headlines stack without excessive leading. Max width should wrap naturally at 8–12 words per line.

### iPhone Mockup Frame
**Role:** Oversized product screenshot with device chrome

Phone rendered at hero scale (roughly 40% of viewport height), with realistic notch and bezel. The device floats over a colored organic blob shape (yellow or teal) that bleeds 20–40px beyond the device edges. Slight tilt or straight-on, no perspective distortion.

### Decorative Blob Shape
**Role:** Organic color shape behind phone mockups

Irregular SVG blob in Signal Yellow (#ffd600) or secondary teal, positioned behind and offset from the phone mockup. Asymmetric, soft-curved, no defined radius — the only organic form in an otherwise rectilinear layout. Functions as visual spotlight and color amplifier.

### Split Section Layout
**Role:** Two-column hero/feature section with text + visual

50/50 split inside the 1200px container (120px outer padding). Headline and CTA stack on one side, phone mockup with blob backing sits on the other. Alternate left/right orientation per section to create Z-pattern reading flow. 80–124px vertical gap between sections.

### Notification Dot
**Role:** Small status indicator on nav items

3–4px solid #ff0062 circle, positioned top-right of a nav label, indicating new/urgent content. Used sparingly — only on items that genuinely require attention.

### In-App Active Tab
**Role:** Selected control chip inside the product mockup

Signal Yellow (#ffd600) pill background with #0d0d0d label text, small radius (4–8px), uppercase or compact caps treatment. Indicates the active editing mode (FACE, BACKGROUND, ADJUST, FX EFFECTS).

### Body Text Block
**Role:** Supporting paragraph copy under headlines

Arial 14px weight 400, line-height 1.43, #333333 or #0d0d0d. Quiet by design — never competes with the display headline. Max width 480–560px to preserve readability.

### Card Surface
**Role:** Light elevated panel for grouped content

#ffffff background, 10px border-radius, subtle 1px #333333 border or no border at all, padding 24–26px. White-on-white means the card reads as quiet grouping, not heavy containment.

## Do's and Don'ts

### Do
- Use #ffd600 as the sole chromatic accent — for CTAs, active in-app states, and blob shapes behind mockups
- Set all display headlines to Cofo Sans 72px weight 700 with -0.007em letter-spacing and 1.0 line-height
- Apply 16px border-radius to all buttons; 10px to cards; no radius on the page canvas
- Alternate text-left/visual-right and text-right/visual-left in feature sections to maintain Z-pattern flow
- Keep vertical section gaps between 84px and 124px — breathing room is part of the brand
- Pair every phone mockup with an organic colored blob behind it, offset 20–40px beyond the device edges
- Use #ff0062 only for the notification dot — never as a CTA or background fill

### Don't
- Don't introduce additional accent colors — the system is monochrome plus one yellow, anything else dilutes the signal
- Don't use light or medium weights (300–500) for display headlines — the 700 weight is the signature
- Don't add drop shadows to buttons, cards, or nav — surfaces stay flat, color does the work
- Don't apply small radii (4–6px) to buttons — 16px is non-negotiable for the soft-pill feel
- Don't use gradients, textures, or photographic backgrounds on the page itself
- Don't center-align display headlines in wide sections — left-align preserves the editorial reading rhythm
- Don't stack phone mockups or use them without the blob backing — the blob is what makes the product feel spotlighted

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 1 | Canvas | `#ffffff` | Page background, primary surface |
| 2 | Accent Bloom | `#ffd600` | Decorative blob shapes, CTA fill, in-app accent panels |

## Elevation

Flat by design — no drop shadows on the main UI. Visual separation comes from generous whitespace, the organic blob shapes behind mockups, and the single yellow color against white rather than from elevation tokens. The one detected shadow is a soft card lift on a rounded surface, used sparingly.

## Imagery

Phone mockups are the hero visual language — oversized, with realistic device chrome, floating over organic blob shapes in yellow or secondary teal. Inside the phones: portrait photography (real faces, candid smiles, expressive crops). No lifestyle or environmental photography on the page itself. The blobs are the only abstract/decorative visual; everything else is either type, device mockup, or the portrait inside the device. Icon style is minimal and absent from the visible screens — the product UI inside the phone uses small filled icons for controls.

## Layout

Full-width white canvas with a 1200px max-width inner container (120px horizontal padding on each side). Hero is a 50/50 split: display headline + yellow CTA on the left, oversized iPhone mockup with yellow blob on the right. Feature sections alternate the split orientation (text-right/visual-left) to create a Z-pattern reading flow. Vertical rhythm is generous: 84–124px between major sections, with no visible dividers or background bands — sections are separated by whitespace alone. Top navigation is a simple horizontal bar: logo lockup left, 4 nav links right, no sticky behavior visible. A light-gray rounded card surface begins to appear at the bottom of the second screen, suggesting a content section follows the alternating feature blocks.

## Agent Prompt Guide

**Quick Color Reference**
- text: #0d0d0d
- background: #ffffff
- border: #333333
- accent (blobs, in-app panels): #ffd600
- primary action: #ffd600 (filled action)
- notification dot: #ff0062

**3-5 Example Component Prompts**

1. **Hero section (split layout):** White #ffffff background, 1200px max-width container with 120px horizontal padding. Left column: display headline 'Cofo Sans 72px weight 700, #0d0d0d, line-height 1.0, letter-spacing -0.504px'. Below: yellow CTA button '#ffd600 fill, #0d0d0d text, 16px radius, 12px 24px padding, label in Cofo Sans 18px weight 700 with → arrow'. Right column: oversized iPhone mockup with a Signal Yellow #ffd600 organic blob shape behind it, offset 30px beyond the device edges.

2. Create a Primary Action Button: #ffd600 background, #0d0d0d text, 9999px radius, compact pill padding. Use this filled treatment for the main CTA.

3. **Top navigation bar:** White #ffffff background, no border or shadow. Left: small triangle icon + 'PRISMA LABS' wordmark in Cofo Sans 14–18px weight 600, #0d0d0d. Right: four nav links (Products, Company, Career, Support) in Cofo Sans 14–18px weight 600, #0d0d0d, 20–24px gap between items. The 'Career' link carries a 3–4px #ff0062 notification dot at its top-right corner.

4. **In-app active tab (inside product mockup):** Pill-shaped chip with #ffd600 fill, #0d0d0d uppercase label, 4–8px radius, 6–10px vertical padding, 12–16px horizontal padding. Used to indicate the active editing mode (e.g., FACE, BACKGROUND).

5. **Body text block under a headline:** Arial 14px weight 400, line-height 1.43, color #333333, max-width 480–560px. Stays quiet and never competes with the display headline above it.

## Similar Brands

- **Apple** — Same product-mockup-on-white-canvas approach with editorial-scale display type and minimal chromatic palette
- **Linear** — Equally restrained single-accent system on white, with bold display headlines doing the personality work
- **Pitch** — Editorial-grade display typography, generous whitespace between sections, monochrome canvas with one signal color
- **Things 3** — Phone mockup as the hero visual, clean white surface, minimal UI ornamentation, single-color accents
- **Lensa (the product itself)** — Direct visual cousin — the in-app editing UI uses the same yellow-on-black pill chips and bold display type

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-ink-black: #0d0d0d;
  --color-paper-white: #ffffff;
  --color-graphite: #333333;
  --color-signal-yellow: #ffd600;
  --color-alert-magenta: #ff0062;

  /* Typography — Font Families */
  --font-cofo-sans: 'Cofo Sans', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-arial: 'Arial', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 10px;
  --leading-caption: 1;
  --tracking-caption: -0.07px;
  --text-body: 14px;
  --leading-body: 1.43;
  --text-subheading: 18px;
  --leading-subheading: 1.11;
  --tracking-subheading: -0.126px;
  --text-heading-sm: 22px;
  --leading-heading-sm: 1.1;
  --tracking-heading-sm: -0.154px;
  --text-display: 72px;
  --leading-display: 1;
  --tracking-display: -0.504px;

  /* Typography — Weights */
  --font-weight-regular: 400;
  --font-weight-semibold: 600;
  --font-weight-bold: 700;

  /* Spacing */
  --spacing-unit: 4px;
  --spacing-12: 12px;
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-84: 84px;
  --spacing-120: 120px;
  --spacing-124: 124px;
  --spacing-136: 136px;
  --spacing-144: 144px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 84-124px;
  --card-padding: 24-26px;
  --element-gap: 16-20px;

  /* Border Radius */
  --radius-lg: 10px;
  --radius-2xl: 16px;

  /* Named Radii */
  --radius-blobs: irregular;
  --radius-cards: 10px;
  --radius-buttons: 16px;

  /* Surfaces */
  --surface-canvas: #ffffff;
  --surface-accent-bloom: #ffd600;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-ink-black: #0d0d0d;
  --color-paper-white: #ffffff;
  --color-graphite: #333333;
  --color-signal-yellow: #ffd600;
  --color-alert-magenta: #ff0062;

  /* Typography */
  --font-cofo-sans: 'Cofo Sans', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-arial: 'Arial', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 10px;
  --leading-caption: 1;
  --tracking-caption: -0.07px;
  --text-body: 14px;
  --leading-body: 1.43;
  --text-subheading: 18px;
  --leading-subheading: 1.11;
  --tracking-subheading: -0.126px;
  --text-heading-sm: 22px;
  --leading-heading-sm: 1.1;
  --tracking-heading-sm: -0.154px;
  --text-display: 72px;
  --leading-display: 1;
  --tracking-display: -0.504px;

  /* Spacing */
  --spacing-12: 12px;
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-84: 84px;
  --spacing-120: 120px;
  --spacing-124: 124px;
  --spacing-136: 136px;
  --spacing-144: 144px;

  /* Border Radius */
  --radius-lg: 10px;
  --radius-2xl: 16px;
}
```
