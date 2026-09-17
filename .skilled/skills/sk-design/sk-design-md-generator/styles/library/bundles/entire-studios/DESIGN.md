# entire studios — Style Reference
> Concrete-walled fashion zine — an editorial runway printed on warm cream paper, where photography is the only luxury.

**Theme:** light

A brutally reductive editorial fashion system: two colors (warm off-white canvas, pure black ink), one monospaced voice, compact spacing, and full-bleed photography that does every emotional job. The warm off-white #e7ecea replaces cold SaaS gray, giving every surface a paper-like, gallery-wall warmth rather than digital sterility. Space Mono at 12–16px and weight 400 refuses typographic hierarchy — distinction comes from position, whitespace, and the sheer scale of a single image, not from a type scale. Components are stripped to their skeleton: announcement bars, centered wordmarks, hairline-adjacent text links, and logo overlays that float over photography without chrome. The system reads like a fashion zine printed on heavy cream stock, not a typical e-commerce template.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Bone | `#e7ecea` | `--color-bone` | Page canvas, card surfaces, image gutters — warm off-white that reads as heavy cream paper or raw plaster, not digital gray |
| Ink | `#000000` | `--color-ink` | Dark supporting neutral for text, icons, and strong contrast. Do not promote it to the primary CTA color |
| Paper White | `#ffffff` | `--color-paper-white` | Reverse text on dark announcement bar, reverse logo overlays on photography |

## Tokens — Typography

### Space Mono — Sole typeface for nav, links, body, labels, and logo lockup. Monospace at weight 400 — the only font — creates a technical, editorial voice; the rigid monospaced rhythm signals fashion-zine rather than commerce. · `--font-space-mono`
- **Substitute:** JetBrains Mono, IBM Plex Mono, DM Mono
- **Weights:** 400
- **Sizes:** 12px, 16px
- **Line height:** 1.33–1.50
- **Letter spacing:** normal
- **Role:** Sole typeface for nav, links, body, labels, and logo lockup. Monospace at weight 400 — the only font — creates a technical, editorial voice; the rigid monospaced rhythm signals fashion-zine rather than commerce.

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 12px | 1.33 | — | `--text-caption` |
| body | 16px | 1.5 | — | `--text-body` |

## Tokens — Spacing & Shapes

**Base unit:** 6px

**Density:** compact

### Spacing Scale

| Name | Value | Token |
|------|-------|-------|
| 6 | 6px | `--spacing-6` |
| 12 | 12px | `--spacing-12` |
| 16 | 16px | `--spacing-16` |
| 18 | 18px | `--spacing-18` |
| 20 | 20px | `--spacing-20` |

### Border Radius

| Element | Value |
|---------|-------|
| tags | 0px |
| cards | 0px |
| images | 0px |
| buttons | 0px |

### Layout

- **Card padding:** 6px
- **Element gap:** 16px

## Components

### Announcement Bar
**Role:** Top-of-page promotional strip

Full-width black (#000000) band, 12px Space Mono 400, white (#ffffff) text, centered, 6px vertical padding. Carries launch news ('adidas x entire studios drop 2 - online now'). No background image, no close button — it is permanent chrome.

### Primary Navigation
**Role:** Site header overlaying the hero image

Three-zone horizontal layout with no visible background: left edge holds a single 12px Space Mono link ('shop'); center holds the 16px Space Mono wordmark 'entire studios'; right edge holds utility links ('search', 'info', 'eur', 'bag (0)') at 12px. Text color is #ffffff over the dark hero, switching to #000000 on light sections. Zero padding between zones — gaps are managed by the page edges and the monospaced character widths.

### Hero Image Plate
**Role:** Full-bleed editorial photography

Edge-to-edge photograph at 100vw, no border-radius, no overlay tint. Aspect ratio roughly 3:2, filling the viewport below the nav. Imagery is the design — no captioning, no cards, no decorative chrome around it.

### Brand Overlay Lockup
**Role:** Co-branded mark on hero imagery

Centered, mid-image. Left half: Adidas three-stripe performance logo (white #ffffff), approximately 60px tall. Vertical hairline divider (1px #ffffff) separates it from the right half: 'entire studios' wordmark at 16px Space Mono 400, #ffffff. No background plate, no shadow — the lockup sits directly on the photograph.

### Image Caption Tag
**Role:** Tiny editorial label on hero

Top-right corner of the hero image, 12px Space Mono 400, #ffffff, fully uppercase ('ADIDAS x ENTIRE STUDIOS'). 16px from the top and right edges. Acts as a credit line, not a CTA.

### Text Link
**Role:** Inline and navigation links

12px Space Mono 400, #000000 on light surfaces, #ffffff on dark/photo. No underline, no hover color shift visible in data — the monospaced kerning carries the typographic weight. 6px horizontal padding when used as a clickable utility.

### Button (filled black)
**Role:** Primary action

#000000 background, #ffffff text, 12px Space Mono 400, 6px vertical / 12px horizontal padding, 0px radius. Inverts to #ffffff bg / #000000 text on hover if state is needed. No shadow, no gradient — a flat black rectangle that reads as utilitarian rather than decorative.

### Section Divider
**Role:** Implicit or hairline separation between content blocks

No decorative divider is used — sections flow into each other through full-bleed imagery and the bone canvas. If a line is needed, it is 1px solid #000000, full container width, no padding around it.

## Do's and Don'ts

### Do
- Use only #e7ecea for the page canvas — never substitute cold grays (#f5f5f5, #fafafa) that would make the system feel like a SaaS template.
- Use only Space Mono at weight 400, at 12px or 16px — no bold variants, no italic, no second typeface, no size outside this two-step scale.
- Let imagery run edge-to-edge at 0px radius — full-bleed plates are the primary content surface, not framed cards.
- Keep all padding values drawn from the 6px base: 6, 12, 16, 18, 20 — never introduce 24, 32, 40px, which would break the compact rhythm.
- Place the announcement bar above the nav as permanent black chrome (#000000 bg, #ffffff text), not as a dismissible cookie-style banner.
- For the co-brand lockup, pair the Adidas mark with 'entire studios' at 16px Space Mono separated by a 1px vertical hairline — never enclose them in a card or plate.
- Switch text color between #000000 and #ffffff based on the underlying surface luminance, not based on a theme toggle — the site is one continuous warm-light world with reverse text over photography.

### Don't
- Do not introduce any chromatic color — no red, no blue, no green, no accent system. The 0% colorfulness is the identity.
- Do not add a type scale beyond 12px and 16px — no 18px, 24px, 48px headlines, no display sizes. Hierarchy is spatial, not typographic.
- Do not use border-radius on cards, buttons, images, or tags — every edge is a sharp 0px. Curves would betray the editorial/zine intent.
- Do not add shadows, gradients, or glow effects. Elevation is achieved by switching to a full-bleed image, not by drop-shadow.
- Do not wrap imagery in rounded cards, decorative frames, or background plates — the photograph sits naked on the bone canvas.
- Do not use bold or semibold weights; Space Mono 400 is the only weight. Emphasis comes from uppercase + 12px caption treatment, not from weight.
- Do not introduce a secondary font for body text or headings — Space Mono is the system voice; pairing it with a humanist sans would dilute the technical-editorial tone.

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 1 | Bone Canvas | `#e7ecea` | Full-page base — everything sits on this warm off-white |
| 2 | Ink Band | `#000000` | Announcement bar and any reverse-mode surfaces |

## Elevation

The system has no shadow vocabulary — elevation is expressed through full-bleed photography replacing flat surfaces, and through the black announcement bar as the only dark inversion of the bone canvas. Zero box-shadows are used; every surface is a flat plane.

## Imagery

Full-bleed editorial fashion photography is the sole visual medium. Images are tightly cropped, often showing two figures in athletic/contemporary poses against textured concrete or plaster walls. Treatment is raw and naturalistic — no filters, no duotones, no overlays. Imagery fills 100vw edge-to-edge with no border-radius, no frame, and no surrounding UI chrome. The photograph carries all mood; the bone canvas and Space Mono labels sit quietly around it. Iconography is absent — no UI icons, only the Adidas three-stripe performance logo as the only mark besides the wordmark.

## Layout

The page is a full-bleed editorial sequence rather than a standard e-commerce grid. The hero is a single full-viewport-width image with no max-width container — photography breaks past any 1200px limit. Navigation is a three-zone overlay floating on the hero (left link, centered wordmark, right utilities) with no background. Content sections below follow the same 100vw width, separated only by the bone canvas and image cuts, not by cards or boxed modules. The rhythm is: black announcement bar → transparent nav → 100vw hero image → likely additional 100vw image plates or text strips on bone canvas. Density is sparse and image-dominant; the design breathes through large photographic areas, not through whitespace within structured components.

## Agent Prompt Guide

**Quick Color Reference**
- Canvas: #e7ecea
- Text / dark surfaces: #000000
- Reverse text: #ffffff
- Borders: 1px #000000 (hairlines only)
- Accent: none (system is fully achromatic)
- primary action: no distinct CTA color

**Example Component Prompts**
1. *Announcement bar:* Full-width #000000 band, 12px Space Mono 400, #ffffff text, centered, 6px padding top and bottom. No close button.
2. *Primary nav:* Three-zone horizontal row over a full-bleed photo. Left edge: 'shop' at 12px Space Mono 400 #ffffff. Center: 'entire studios' at 16px Space Mono 400 #ffffff. Right edge: 'search | info | eur | bag (0)' at 12px Space Mono 400 #ffffff, separated by spaces. No background, no border.
3. *Hero image plate:* Edge-to-edge photograph at 100vw, 0px radius, no border, no overlay. Below the nav.
4. *Co-brand lockup:* Centered on the hero. Left: Adidas three-stripe logo in #ffffff, ~60px tall. 1px vertical #ffffff hairline divider. Right: 'entire studios' at 16px Space Mono 400 #ffffff.
5. *Image caption tag:* Top-right of hero, 16px from top and right edges, 12px Space Mono 400 #ffffff, uppercase.

## Similar Brands

- **Aesop** — Same restraint-by-omission approach — near-zero UI chrome, full-bleed photography, and a single serif/sans voice carrying all hierarchy
- **COS (cosstores.com)** — Editorial fashion grid with full-bleed imagery, minimal navigation, and monochrome canvas replacing typical e-commerce templates
- **ssense** — Extreme typographic minimalism and full-viewport editorial imagery over a near-white canvas
- **Our Legacy** — Warm off-white canvas, single-weight sans/mono voice, and brutalist product presentation without cards or decorative frames
- **Adidas Confirmed / Y-3** — Adidas-affiliated sub-brand co-marketing treatment with the three-stripe mark paired against a fashion-editorial wordmark, shared by the current site

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-bone: #e7ecea;
  --color-ink: #000000;
  --color-paper-white: #ffffff;

  /* Typography — Font Families */
  --font-space-mono: 'Space Mono', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.33;
  --text-body: 16px;
  --leading-body: 1.5;

  /* Typography — Weights */
  --font-weight-regular: 400;

  /* Spacing */
  --spacing-unit: 6px;
  --spacing-6: 6px;
  --spacing-12: 12px;
  --spacing-16: 16px;
  --spacing-18: 18px;
  --spacing-20: 20px;

  /* Layout */
  --card-padding: 6px;
  --element-gap: 16px;

  /* Named Radii */
  --radius-tags: 0px;
  --radius-cards: 0px;
  --radius-images: 0px;
  --radius-buttons: 0px;

  /* Surfaces */
  --surface-bone-canvas: #e7ecea;
  --surface-ink-band: #000000;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-bone: #e7ecea;
  --color-ink: #000000;
  --color-paper-white: #ffffff;

  /* Typography */
  --font-space-mono: 'Space Mono', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.33;
  --text-body: 16px;
  --leading-body: 1.5;

  /* Spacing */
  --spacing-6: 6px;
  --spacing-12: 12px;
  --spacing-16: 16px;
  --spacing-18: 18px;
  --spacing-20: 20px;
}
```
