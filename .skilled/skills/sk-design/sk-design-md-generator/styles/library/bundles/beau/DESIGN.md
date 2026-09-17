# Beau — Style Reference
> Ink on warm parchment — confident monochromatic editorial with a single theatrical gradient spotlight.

**Theme:** light

Beau operates as an editorial broadcast booth for client documents: a warm-paper canvas, confident near-black ink, and one theatrical orange-to-indigo gradient that acts as a spotlight. The system is aggressively monochromatic — color is rationed to the point of ceremony, reserved for product frames, feature pills, and one section-width wash. Typography does almost all the expressive work via tight Geist tracking and a narrow 400/500 weight axis, creating a hushed but authoritative voice. Surfaces are flat and matte with whisper-quiet 6px corners; the only soft shadow is a 2px atmospheric haze. Buttons are fully pill-shaped (200px radius), making even the smallest interaction feel like a broadcast button on a studio console.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Paper White | `#ffffff` | `--color-paper-white` | Primary page canvas, card surfaces, button text on dark fills |
| Warm Parchment | `#f6f4f1` | `--color-warm-parchment` | Alternate section surface — gives the cream/ivory warmth that stops the page from feeling clinical |
| Ink Black | `#000000` | `--color-ink-black` | Primary text, dark feature card surfaces, filled pill button background, hairline borders — the structural backbone of every screen |
| Soft Graphite | `#666666` | `--color-soft-graphite` | Secondary text, muted helper copy, quiet borders on neutral sections |
| Mid Ash | `#999999` | `--color-mid-ash` | Tertiary metadata, section subtitles, low-emphasis text |
| Pale Mist | `#b3b3b3` | `--color-pale-mist` | Disabled badge fill, very low-emphasis surface washes |
| Broadcast Gradient | `linear-gradient(135deg, rgb(255, 131, 8), rgb(255, 80, 67) 50%, rgb(57, 43, 213))` | `--color-broadcast-gradient` | Signature accent — used only for product screenshot frames, feature pill backgrounds, and the one full-width section wash; the gradient itself carries the brand voice, so the orange leading stop represents it in solid form |

## Tokens — Typography

### Geist — Sole typeface across nav, body, headings, and buttons. Weight 400 carries body and most copy; weight 500 is reserved for subheadings, labels, and emphasis. The Geist stylistic sets ss01, ss03, ss04 are enabled — these alter the alternate single-storey 'a', the geometric 'g', and the modernist '$' to give the type a custom editorial feel. Substitute with Inter at the same weights if Geist is unavailable. · `--font-geist`
- **Substitute:** Inter
- **Weights:** 400, 500
- **Sizes:** 14, 17, 20, 28, 33, 40, 56
- **Line height:** 1.10–1.40
- **Letter spacing:** -0.02em at 28–56px, -0.01em at 14–20px
- **OpenType features:** `"ss01" on, "ss03" on, "ss04" on`
- **Role:** Sole typeface across nav, body, headings, and buttons. Weight 400 carries body and most copy; weight 500 is reserved for subheadings, labels, and emphasis. The Geist stylistic sets ss01, ss03, ss04 are enabled — these alter the alternate single-storey 'a', the geometric 'g', and the modernist '$' to give the type a custom editorial feel. Substitute with Inter at the same weights if Geist is unavailable.

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 14px | 1.4 | -0.14px | `--text-caption` |
| body | 17px | 1.4 | -0.17px | `--text-body` |
| subheading | 20px | 1.3 | -0.2px | `--text-subheading` |
| heading-sm | 28px | 1.2 | -0.56px | `--text-heading-sm` |
| heading | 33px | 1.15 | -0.66px | `--text-heading` |
| heading-lg | 40px | 1.15 | -0.8px | `--text-heading-lg` |
| display | 56px | 1.1 | -1.12px | `--text-display` |

## Tokens — Spacing & Shapes

**Base unit:** 6px

**Density:** comfortable

### Spacing Scale

| Name | Value | Token |
|------|-------|-------|
| 6 | 6px | `--spacing-6` |
| 12 | 12px | `--spacing-12` |
| 18 | 18px | `--spacing-18` |
| 24 | 24px | `--spacing-24` |
| 30 | 30px | `--spacing-30` |
| 36 | 36px | `--spacing-36` |
| 48 | 48px | `--spacing-48` |
| 72 | 72px | `--spacing-72` |
| 96 | 96px | `--spacing-96` |

### Border Radius

| Element | Value |
|---------|-------|
| cards | 6px |
| badges | 200px |
| images | 6px |
| buttons | 200px |

### Shadows

| Name | Value | Token |
|------|-------|-------|
| sm | `rgba(0, 0, 0, 0.06) 0px 2px 6px 0px` | `--shadow-sm` |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 72px
- **Card padding:** 24px
- **Element gap:** 24px

## Components

### Pill Button (Primary)
**Role:** Primary action — the only filled button in the system

Black background (#000000), white text (#ffffff), 200px border-radius for full pill shape, 18px horizontal padding, 12px vertical padding. Geist 500 weight at 14px with -0.14px tracking. Used for the single highest-priority action per screen (e.g. 'Request Demo').

### Ghost Text Link
**Role:** Secondary navigation and inline links

No background, no border. Geist 400 at 14px in #000000. Underline only on hover. Used for nav items and low-emphasis inline actions.

### Dark Feature Card
**Role:** High-emphasis content block — inverted surface for key value propositions

Black (#000000) background, white text, 6px border-radius, 24px padding. Optional 2px atmospheric shadow. Headlines at 28–33px in Geist 500, body at 17px in Geist 400. Used in a two-column layout beside product imagery.

### Gradient-Framed Product Card
**Role:** Showcases the product interface inside a gradient border frame

6px border-radius container with a 3–4px padding ring in the orange-red-indigo broadcast gradient, then the white product screenshot inset. This is the only place the gradient appears as a decorative frame, and it acts as the visual signature of any product moment.

### Feature Pill
**Role:** Compact feature highlight — icon + short label in a pill

200px border-radius, padding 12px 18px, filled with the broadcast gradient, white icon and text at 14px Geist 500. Used in grids to enumerate product capabilities.

### Navigation Bar
**Role:** Sticky top header with brand mark, center links, and right-aligned CTA

White background, no border, 96px vertical padding at the hero. Brand mark on the left (logo + 'BEAU' wordmark in Geist 500), centered nav links in Geist 400, single Pill Button on the right. Extremely minimal — no search, no language toggle, no user menu.

### Upload Interface Card
**Role:** In-context product UI showing document upload state

White surface with 6px radius, 24px padding, hairline border at #e5e5e5 equivalent. Contains a dashed upload zone at the top (black dashed border, 6px radius) and a checklist below with status labels ('Waiting for file', 'Analyzing...') in Geist 400 with circular status indicators.

### Form Verification Mockup
**Role:** Product UI showing the verification result state

Light surface card showing a form field (e.g. 'David Wastall') with a cloud upload zone below and a green/red pass-fail checklist on the right. Green check items in #00a86b equivalent, red cross items in #d64545 equivalent. Monospaced Geist 400 for field labels.

### Gradient Section Band
**Role:** Full-width section wash — the gradient's headline appearance

A 100%-width band filled with the broadcast gradient (135deg, orange → red → indigo). Dark feature cards or white content blocks sit on top, creating a theatrical contrast. Used once or twice per page maximum.

### Section Heading Stack
**Role:** The canonical headline + subhead block at the top of every section

Centered or left-aligned. Display/heading text at 33–56px in Geist 500, tight tracking (-0.66 to -1.12px). Subhead at 17–20px in Geist 400 in #666666. The 'highlight phrase' inside the headline often shifts to #666666 or stays black — no color highlighting, only weight and size.

### Two-Column Feature Row
**Role:** Standard content rhythm: product visual left, text right (or alternating)

Max-width 1200px container, 48–72px row gap between columns. Left column holds a product screenshot or gradient-framed card; right column holds a heading + paragraph + optional CTA. The alternation between this and a full-width gradient band creates the page rhythm.

## Do's and Don'ts

### Do
- Use the broadcast gradient (135deg, #ff8308 → #ff5043 → #392bd5) exclusively for product frames, feature pills, and at most one full-width section band per page
- Set all buttons and feature pills to 200px border-radius — the fully pill-shaped button is a core signature
- Set all cards, images, and badges to 6px border-radius — subtle, never rounded enough to feel friendly
- Apply Geist 500 for headings and labels, Geist 400 for body — never introduce weight 600 or 700; the narrow weight axis is intentional
- Use #f6f4f1 as the warm parchment for alternate section surfaces rather than a hard border or divider
- Enable font features 'ss01', 'ss03', 'ss04' on all Geist text — these stylistic sets are part of the brand voice
- Use 72px as the standard section gap and 24px as the element gap inside cards

### Don't
- Do not introduce any chromatic color outside the broadcast gradient — the system is monochrome by design
- Do not use 6px or 8px radius on buttons or pills — only 200px (full pill) is correct
- Do not use heavy shadows or elevation — the only approved shadow is the 2px 6%-black atmospheric haze
- Do not use type weights outside 400 and 500 — bold and semibold would break the restrained editorial voice
- Do not place white cards on the gradient band — use dark (#000000) feature cards or let the gradient breathe
- Do not use #0000ee or browser-default link blue — links are always black with optional underline
- Do not crowd sections — if a section feels tight, increase the 72px gap rather than reducing font sizes

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Paper White | `#ffffff` | Default page canvas, product card interiors |
| 1 | Warm Parchment | `#f6f4f1` | Alternate section background — provides the ivory warmth and separates content bands without needing a hard line |
| 2 | Ink Black | `#000000` | Dark feature cards, inverted content blocks — used as a surface, not just text |

## Elevation

- **Feature Card:** `rgba(0, 0, 0, 0.06) 0px 2px 6px 0px`

## Imagery

Visuals are dominated by in-context product UI screenshots — the actual Beau interface rendered at near-full size, never abstract illustrations. Product shots are framed inside a thin gradient border ring, which is the only decorative treatment. The gradient itself (orange → red → indigo) is used as a full-bleed section wash once, acting as the lone piece of color theatre on an otherwise monochrome page. No photography, no 3D renders, no stock illustration. Icons are simple line glyphs in a single weight, used inside gradient pills. The visual identity rests on restraint: the product UI is the hero, the gradient is the spotlight, and everything else is paper and ink.

## Layout

Page is a max-width 1200px centered canvas with generous 72px section gaps and 96px hero padding. The hero is a centered headline + subhead + two-column product frame (gradient-ringed product card on the left, dark feature card on the right). Below the hero, content alternates between left-aligned text+image two-column rows and a single full-width gradient band that contains a 3-column grid of gradient-filled feature pills. Navigation is a minimal sticky top bar: logo left, two center links, single pill CTA right — no dropdowns, no sidebar, no footer complexity visible above the fold. The density is deliberately spacious: one idea per section, 72px of breathing room between them, no decorative dividers — the surface color shift from white to warm parchment to black to gradient is the only structural device.

## Agent Prompt Guide

**Quick Color Reference**
- text: #000000
- background: #ffffff
- alternate surface: #f6f4f1
- border: #000000 (structural) / #e5e5e5 (hairline)
- accent gradient: linear-gradient(135deg, #ff8308, #ff5043 50%, #392bd5)
- primary action: #000000 (filled action)

**Example Component Prompts**
1. *Create a section hero:* Centered display headline at 56px Geist 500, #000000, letter-spacing -1.12px, line-height 1.10. Subhead at 17px Geist 400, #666666, line-height 1.40. 96px top/bottom padding, max-width 1200px centered.

2. *Create a dark feature card:* 6px border-radius, #000000 background, 24px padding, optional shadow rgba(0,0,0,0.06) 0px 2px 6px. Heading at 28px Geist 500 white, body at 17px Geist 400 white. Sit beside a gradient-framed product screenshot.

3. *Create a gradient product frame:* Outer container with 6px border-radius and 3px padding filled by the broadcast gradient (135deg, #ff8308 → #ff5043 50% → #392bd5). Inner container is a white #ffffff product screenshot at 6px radius.

4. *Create a feature pill:* 200px border-radius, broadcast gradient background, 12px 18px padding. Icon + label in Geist 500 14px white, letter-spacing -0.14px. Use in a 3-column grid with 24px gaps.

5. *Create the navigation bar:* White background, no border, 96px vertical padding. Left: brand mark in Geist 500. Center: two ghost text links in Geist 400 14px black. Right: a single filled pill button (#000000 bg, white text, 200px radius, 12px 18px padding).

## Similar Brands

- **Linear** — Same monochromatic near-black-and-white palette with a single restrained type voice and pill-shaped controls; shares the editorial-restraint approach to color
- **Vercel** — Both are built on Geist as the primary typeface with ss01/ss03/ss04 stylistic sets enabled, and both lean on near-flat surfaces with minimal shadow
- **Notion** — Same generous whitespace, centered narrow text blocks, and warm-paper approach to content — though Beau is more typographically confident
- **Stripe** — Both deploy a single signature gradient as the lone burst of color on an otherwise grayscale interface, treating the gradient as theatrical punctuation

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-paper-white: #ffffff;
  --color-warm-parchment: #f6f4f1;
  --color-ink-black: #000000;
  --color-soft-graphite: #666666;
  --color-mid-ash: #999999;
  --color-pale-mist: #b3b3b3;
  --color-broadcast-gradient: #ff8308;
  --gradient-broadcast-gradient: linear-gradient(135deg, rgb(255, 131, 8), rgb(255, 80, 67) 50%, rgb(57, 43, 213));

  /* Typography — Font Families */
  --font-geist: 'Geist', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 14px;
  --leading-caption: 1.4;
  --tracking-caption: -0.14px;
  --text-body: 17px;
  --leading-body: 1.4;
  --tracking-body: -0.17px;
  --text-subheading: 20px;
  --leading-subheading: 1.3;
  --tracking-subheading: -0.2px;
  --text-heading-sm: 28px;
  --leading-heading-sm: 1.2;
  --tracking-heading-sm: -0.56px;
  --text-heading: 33px;
  --leading-heading: 1.15;
  --tracking-heading: -0.66px;
  --text-heading-lg: 40px;
  --leading-heading-lg: 1.15;
  --tracking-heading-lg: -0.8px;
  --text-display: 56px;
  --leading-display: 1.1;
  --tracking-display: -1.12px;

  /* Typography — Weights */
  --font-weight-regular: 400;
  --font-weight-medium: 500;

  /* Spacing */
  --spacing-unit: 6px;
  --spacing-6: 6px;
  --spacing-12: 12px;
  --spacing-18: 18px;
  --spacing-24: 24px;
  --spacing-30: 30px;
  --spacing-36: 36px;
  --spacing-48: 48px;
  --spacing-72: 72px;
  --spacing-96: 96px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 72px;
  --card-padding: 24px;
  --element-gap: 24px;

  /* Border Radius */
  --radius-md: 6px;
  --radius-full: 200px;

  /* Named Radii */
  --radius-cards: 6px;
  --radius-badges: 200px;
  --radius-images: 6px;
  --radius-buttons: 200px;

  /* Shadows */
  --shadow-sm: rgba(0, 0, 0, 0.06) 0px 2px 6px 0px;

  /* Surfaces */
  --surface-paper-white: #ffffff;
  --surface-warm-parchment: #f6f4f1;
  --surface-ink-black: #000000;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-paper-white: #ffffff;
  --color-warm-parchment: #f6f4f1;
  --color-ink-black: #000000;
  --color-soft-graphite: #666666;
  --color-mid-ash: #999999;
  --color-pale-mist: #b3b3b3;
  --color-broadcast-gradient: #ff8308;

  /* Typography */
  --font-geist: 'Geist', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 14px;
  --leading-caption: 1.4;
  --tracking-caption: -0.14px;
  --text-body: 17px;
  --leading-body: 1.4;
  --tracking-body: -0.17px;
  --text-subheading: 20px;
  --leading-subheading: 1.3;
  --tracking-subheading: -0.2px;
  --text-heading-sm: 28px;
  --leading-heading-sm: 1.2;
  --tracking-heading-sm: -0.56px;
  --text-heading: 33px;
  --leading-heading: 1.15;
  --tracking-heading: -0.66px;
  --text-heading-lg: 40px;
  --leading-heading-lg: 1.15;
  --tracking-heading-lg: -0.8px;
  --text-display: 56px;
  --leading-display: 1.1;
  --tracking-display: -1.12px;

  /* Spacing */
  --spacing-6: 6px;
  --spacing-12: 12px;
  --spacing-18: 18px;
  --spacing-24: 24px;
  --spacing-30: 30px;
  --spacing-36: 36px;
  --spacing-48: 48px;
  --spacing-72: 72px;
  --spacing-96: 96px;

  /* Border Radius */
  --radius-md: 6px;
  --radius-full: 200px;

  /* Shadows */
  --shadow-sm: rgba(0, 0, 0, 0.06) 0px 2px 6px 0px;
}
```
