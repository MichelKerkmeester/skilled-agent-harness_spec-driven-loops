# Tailscale — Style Reference
> Engineer's whiteboard on cream paper. A warm off-white canvas with a single red marker stroke, soft 16px corners, and Inter at whisper weights — the visual language of infrastructure documentation that respects the reader.

**Theme:** light

Tailscale's visual system is a warm, paper-grounded infrastructure UI that treats network security as approachable rather than intimidating. A cream canvas (#eeebea) replaces the typical stark white SaaS background, and a single Signal Red (#d04841) acts as rare punctuation against a near-black (#181717) text and border system. Typography stays conversational — Inter at light weights (300-400) for headlines rather than the usual bold-shout, and a custom geometric (MDIO) reserved for small technical labels with wide tracking. Components are soft and rounded (16px is the dominant radius for cards, nav, images, and buttons), shadows are barely perceptible (2% black at 4px blur), and the overall feel is a confident engineer's notebook rather than a corporate dashboard.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Ink | `#181717` | `--color-ink` | Dark borders and separators for elevated surfaces and inverted UI. Do not promote it to the primary CTA color |
| Bone | `#eeebea` | `--color-bone` | Page canvas and section backgrounds — the warm off-white ground that sets the whole system apart from stark-white SaaS |
| Paper | `#ffffff` | `--color-paper` | Card surfaces, product UI panels, testimonial tiles, integration logos — lifted off the Bone canvas to create depth |
| Graphite | `#2e2d2d` | `--color-graphite` | Secondary borders, body text dividers, nav rules — one step lighter than Ink for layered information |
| Charcoal | `#575555` | `--color-charcoal` | Muted body text, helper labels, subtle borders — the middle gray for de-emphasized content |
| Ash | `#706e6d` | `--color-ash` | Tertiary borders, caption text — the quietest gray, used where structure must recede |
| Linen | `#f7f5f4` | `--color-linen` | Elevated surface tint, nav background variant — sits between Bone and Paper for subtle layering |
| Mist | `#d5d3d2` | `--color-mist` | Shadow color base, very light dividers — the tonal anchor for the 2% opacity shadow system |
| Signal Red | `#d04841` | `--color-signal-red` | Brand accent for highlighted feature cards, active nav indicators, and emphasis strokes — used in 5% of the interface to make the other 95% feel intentional |
| Network Blue | `linear-gradient(in oklab, #5a82de 0px, #324994 100%)` | `--color-network-blue` | Decorative product-screenshot gradient — warm red against matte black creates urgency without aggression; blue is reserved for inside-the-product imagery, never for UI controls |

## Tokens — Typography

### Inter — Primary workhorse — body text at 400/16px, UI at 500/14px, and headlines at 300/48-64px. The light-weight headlines are a signature anti-convention choice: most infra brands shout with 700+, Tailscale whispers with 300, creating authority through restraint rather than volume. · `--font-inter`
- **Substitute:** Inter (Google Fonts) or IBM Plex Sans
- **Weights:** 300, 400, 500, 600
- **Sizes:** 12, 14, 16, 20, 32, 48, 64
- **Line height:** 1.2-1.5
- **Letter spacing:** -0.30px at 12px, -0.30px at 14px, -0.30px at 16px, -0.40px at 20px, -0.96px at 48px, -1.92px at 64px
- **Role:** Primary workhorse — body text at 400/16px, UI at 500/14px, and headlines at 300/48-64px. The light-weight headlines are a signature anti-convention choice: most infra brands shout with 700+, Tailscale whispers with 300, creating authority through restraint rather than volume.

### MDIO — Branded labels and eyebrows — appears on small caps tags, nav items, and category markers with 0.043-0.050em positive tracking. The wide letter-spacing transforms tiny text into technical insignia rather than body copy. This is the system's 'voice' font. · `--font-mdio`
- **Substitute:** Space Grotesk 500 with letter-spacing: 0.05em, or DM Sans 500 with letter-spacing: 0.05em
- **Weights:** 500
- **Sizes:** 12, 14, 20
- **Line height:** 1.2-1.5
- **Letter spacing:** 0.0430em, 0.0500em
- **Role:** Branded labels and eyebrows — appears on small caps tags, nav items, and category markers with 0.043-0.050em positive tracking. The wide letter-spacing transforms tiny text into technical insignia rather than body copy. This is the system's 'voice' font.

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 12px | 1.5 | 0.6px | `--text-caption` |
| body-sm | 14px | 1.43 | — | `--text-body-sm` |
| body | 16px | 1.5 | — | `--text-body` |
| subheading | 20px | 1.5 | -0.2px | `--text-subheading` |
| heading | 32px | 1.2 | -0.64px | `--text-heading` |
| heading-lg | 48px | 1.2 | -0.96px | `--text-heading-lg` |
| display | 64px | 1.2 | -1.92px | `--text-display` |

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
| 48 | 48px | `--spacing-48` |
| 64 | 64px | `--spacing-64` |
| 84 | 84px | `--spacing-84` |
| 168 | 168px | `--spacing-168` |

### Border Radius

| Element | Value |
|---------|-------|
| nav | 16px |
| pill | 9999px |
| cards | 16px |
| images | 16px |
| buttons | 8px |
| hero-cards | 32px |

### Shadows

| Name | Value | Token |
|------|-------|-------|
| sm | `rgba(24, 23, 23, 0.02) 0px 4px 8px 0px` | `--shadow-sm` |
| md | `rgba(24, 23, 23, 0.16) 0px 4px 16px 0px` | `--shadow-md` |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 80-96px
- **Card padding:** 24-32px
- **Element gap:** 12-16px

## Components

### Top Navigation Bar
**Role:** Sticky header with logo, centered nav links, and right-aligned login + CTA

Background #f7f5f4 or transparent over Bone canvas. Logo mark (Tailscale dots) at left in #181717, 12px. Nav links in Inter 500/14px #181717, separated by subtle 1px Graphite dividers. Right side: 'Login' as ghost text link and 'Get started' as Ink-filled button. Height ~64px, full-width with inner max-width 1200px padding. Bottom border 1px #eeebea.

### Primary CTA Button (Filled)
**Role:** The main action button — dark filled with white text

Background #181717, text #ffffff, Inter 500/14px. Border-radius 8px. Padding 10px 18px. Subtle box-shadow: rgba(24,23,23,0.02) 0px 4px 8px 0px. No hover lift — the button stays flat and grounded.

### Ghost Text Link
**Role:** Secondary action paired with a primary CTA

Text only, no background, Inter 500/14px #181717 with underline on hover. Padding 10px 12px. Sits beside the filled CTA at equal weight, differentiated only by fill.

### Hero Section
**Role:** First viewport — large centered headline over Bone canvas

Centered layout, max-width ~900px. Headline Inter 300/64px #181717 letter-spacing -1.92px, line-height 1.2. Subtext Inter 400/16px #575555, max-width 640px, centered. CTA pair (filled + ghost) below at 24px gap. 96px vertical padding top and bottom.

### Feature Highlight Card (Red)
**Role:** First card in a horizontal feature row — full-color accent

Background #d04841, text #ffffff, border-radius 16px, padding 24px. Small Inter 500/12px uppercase eyebrow at top, Inter 500/20px title, Inter 400/14px description. White outline icon top-left. This is the only place Signal Red fills a surface.

### Feature Card (Text-Only)
**Role:** Secondary items in the feature row — quiet companions to the red card

No background fill (sits on Bone canvas). Small outlined icon in #181717 at 20px, 8px below the icon a Inter 500/20px title in #181717, 8px below that Inter 400/14px description in #575555. Generous 32px gap between cards in the row.

### Product Showcase Card
**Role:** Large white panel containing a product UI screenshot

Background #ffffff, border-radius 16px (or 32px for hero-tier showcases), padding 0 (image bleeds to edges), box-shadow rgba(24,23,23,0.02) 0px 4px 8px 0px. Sits inside a Bone canvas section. Product UI inside often shows a red header bar (#d04841) and a blue gradient (#5a82de → #324994) on a secondary panel.

### Stat Block
**Role:** Three-column social proof — company logo + large number

Centered in each column. Company logo at top (16px tall, original brand color). Below: Inter 300/48px #181717 number (e.g. '1,000+'). No card wrapper, no border — sits directly on Bone canvas with 32px column gap.

### Testimonial Card
**Role:** Developer quote with avatar, name, handle, and X icon

Background #ffffff, border-radius 16px, padding 24px. Avatar 40px circle top-left, name in Inter 500/14px #181717 and handle in Inter 400/12px #575555 beside it. X (Twitter) icon top-right in #181717. Quote text Inter 400/14px #181717 below, line-height 1.5. Subtle shadow rgba(24,23,23,0.02) 0px 4px 8px 0px.

### Integration Logo Tile
**Role:** Grid cell showing a third-party product logo

Background #ffffff, border-radius 16px, padding 24px, centered logo at 32px. No border, just the subtle shadow. Arranged in a 8-column grid with 8px gap. Logos keep their original brand colors — the tiles are the only place non-system colors appear.

### Footer Link Column
**Role:** Site footer with grouped links

Section heading in Inter 500/12px #181717 with 0.05em tracking (MDIO-style). Links below in Inter 400/14px #575555, 12px row gap. No dividers between groups. Footer sits on Bone canvas.

### Section Heading (Centered)
**Role:** Inter 300 headline introducing each major section

Inter 300/48px #181717, letter-spacing -0.96px, centered, max-width 700px. Followed by 24px gap, then Inter 400/16px #575555 subtext. 64px top padding from previous section.

## Do's and Don'ts

### Do
- Use #eeebea as the page canvas — never default to #ffffff for full-page backgrounds
- Use Inter 300-400 for all headlines; reserve 500-600 for UI labels and buttons only
- Set border-radius to 16px for all cards, nav bars, and image containers
- Use Signal Red (#d04841) on at most one element per row — it should feel like punctuation, not decoration
- Apply the signature shadow rgba(24,23,23,0.02) 0px 4px 8px 0px for all card elevation
- Use MDIO (or Space Grotesk 500 + 0.05em tracking) for all small uppercase eyebrow labels and category tags
- Maintain 80-96px vertical section gaps to keep the system breathable

### Don't
- Don't use pure #000 for text or buttons — always #181717
- Don't use bright blue, green, or purple for CTAs — those colors are reserved for product UI screenshots only
- Don't apply bold (700+) weights to display headlines — the 300 weight is the signature
- Don't use sharp 0px or 4px radii on cards — minimum is 8px for buttons, 16px for everything else
- Don't add heavy drop shadows (10%+ opacity) — the system relies on near-invisible elevation
- Don't alternate dark/light section bands — stay on the Bone canvas with white cards lifted from it
- Don't use more than one accent color per page — Signal Red is the only chromatic voice

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Canvas | `#eeebea` | Page background and section bands — the warm off-white ground |
| 1 | Surface | `#ffffff` | Cards, product UI panels, testimonial tiles — lifted off canvas |
| 2 | Elevated | `#f7f5f4` | Nav background variant and subtle elevation tint |

## Elevation

- **Cards, nav, buttons, product showcases:** `rgba(24, 23, 23, 0.02) 0px 4px 8px 0px`
- **Hover state on nav and primary buttons:** `rgba(24, 23, 23, 0.16) 0px 4px 16px 0px`

## Imagery

Imagery is product-led and tightly cropped: large white panels showing the Tailscale desktop app with a red header bar, inbox, and status panel. Integration logos appear in a dense 8-column grid, each in its native brand color, framed by white tiles. Photography is absent — the system communicates through UI screenshots, partner logos, and developer avatars rather than lifestyle or abstract imagery. Illustrations are not used.

## Layout

Max-width 1200px centered with generous side padding. The hero is centered text-only over the Bone canvas with no image, followed by a 5-column horizontal feature row where the first cell is a red-filled card and the remaining four are text-only. Product showcases are full-width white panels with 32px+ border-radius, bleeding close to the viewport edges. Sections are separated by 80-96px vertical gaps on the same Bone canvas — no dark/light alternation. The stats row is a 3-column centered grid, testimonials a 3-column card row with edge cards peeking, and integrations an 8-column dense logo grid. Navigation is a single top bar, no sidebar.

## Agent Prompt Guide

**Quick Color Reference**
- text: #181717
- background: #eeebea (canvas) / #ffffff (cards)
- border: #2e2d2d
- accent: #d04841
- primary action: #d04841 (filled action)

**Example Component Prompts**

1. Create a Primary Action Button: #d04841 background, #ffffff text, 9999px radius, compact pill padding. Use this filled treatment for the main CTA.

2. **Feature row card (text-only)**: Transparent background on #eeebea canvas. 20px outlined icon in #181717 at top. 8px gap, then Inter 500/20px #181717 title. 8px gap, then Inter 400/14px #575555 description. No border, no shadow. 32px gap to next card.

3. **Feature highlight card (red)**: Background #d04841, text #ffffff, 16px radius, 24px padding. White outline icon (20px) top-left. Inter 500/12px eyebrow with 0.05em tracking, 8px gap, Inter 500/20px title, 8px gap, Inter 400/14px description.

4. **Testimonial card**: Background #ffffff, 16px radius, 24px padding, shadow rgba(24,23,23,0.02) 0px 4px 8px 0px. 40px circular avatar top-left, beside it Inter 500/14px #181717 name and Inter 400/12px #575555 handle. X icon (16px) top-right in #181717. Quote Inter 400/14px #181717 line-height 1.5 below, 16px gap from header.

5. **Product showcase panel**: Background #ffffff, 16px radius, 0px padding (image bleeds), shadow rgba(24,23,23,0.02) 0px 4px 8px 0px. Inside: desktop UI screenshot with red #d04841 header bar, white content area, and a secondary blue panel showing #5a82de → #324994 gradient. Sits on #eeebea canvas section with 80px gap above and below.

## Similar Brands

- **Linear** — Same light-mode discipline with a single accent color, generous spacing, and Inter-based typography at controlled weights — though Linear runs cooler and more purple, Tailscale runs warmer and more red
- **Vercel** — Same near-black (#000/#111) text system, black-filled CTAs, and a single accent color used sparingly — Vercel uses orange/blue, Tailscale uses red, but the restraint discipline is identical
- **Cloudflare** — Same infrastructure-devtools audience and same approach of using a warm canvas + single brand accent + Inter for body — Cloudflare leans more orange, Tailscale leans more red, but the 'paper-grounded' canvas strategy is shared
- **Plausible Analytics** — Same cream/off-white canvas discipline and generous 16px radii on cards — both reject the stark-white SaaS default in favor of a warmer, more document-like ground
- **Fly.io** — Same developer-tool audience with warm off-white canvas, Inter typography, and 16px+ card radii — the 'engineer's notebook' visual metaphor is nearly identical

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-ink: #181717;
  --color-bone: #eeebea;
  --color-paper: #ffffff;
  --color-graphite: #2e2d2d;
  --color-charcoal: #575555;
  --color-ash: #706e6d;
  --color-linen: #f7f5f4;
  --color-mist: #d5d3d2;
  --color-signal-red: #d04841;
  --color-network-blue: #5a82de;
  --gradient-network-blue: linear-gradient(in oklab, #5a82de 0px, #324994 100%);

  /* Typography — Font Families */
  --font-inter: 'Inter', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-mdio: 'MDIO', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.5;
  --tracking-caption: 0.6px;
  --text-body-sm: 14px;
  --leading-body-sm: 1.43;
  --text-body: 16px;
  --leading-body: 1.5;
  --text-subheading: 20px;
  --leading-subheading: 1.5;
  --tracking-subheading: -0.2px;
  --text-heading: 32px;
  --leading-heading: 1.2;
  --tracking-heading: -0.64px;
  --text-heading-lg: 48px;
  --leading-heading-lg: 1.2;
  --tracking-heading-lg: -0.96px;
  --text-display: 64px;
  --leading-display: 1.2;
  --tracking-display: -1.92px;

  /* Typography — Weights */
  --font-weight-light: 300;
  --font-weight-regular: 400;
  --font-weight-medium: 500;
  --font-weight-semibold: 600;

  /* Spacing */
  --spacing-unit: 4px;
  --spacing-4: 4px;
  --spacing-8: 8px;
  --spacing-12: 12px;
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-48: 48px;
  --spacing-64: 64px;
  --spacing-84: 84px;
  --spacing-168: 168px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 80-96px;
  --card-padding: 24-32px;
  --element-gap: 12-16px;

  /* Border Radius */
  --radius-lg: 8px;
  --radius-2xl: 16px;
  --radius-3xl: 32px;
  --radius-full: 9999px;

  /* Named Radii */
  --radius-nav: 16px;
  --radius-pill: 9999px;
  --radius-cards: 16px;
  --radius-images: 16px;
  --radius-buttons: 8px;
  --radius-hero-cards: 32px;

  /* Shadows */
  --shadow-sm: rgba(24, 23, 23, 0.02) 0px 4px 8px 0px;
  --shadow-md: rgba(24, 23, 23, 0.16) 0px 4px 16px 0px;

  /* Surfaces */
  --surface-canvas: #eeebea;
  --surface-surface: #ffffff;
  --surface-elevated: #f7f5f4;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-ink: #181717;
  --color-bone: #eeebea;
  --color-paper: #ffffff;
  --color-graphite: #2e2d2d;
  --color-charcoal: #575555;
  --color-ash: #706e6d;
  --color-linen: #f7f5f4;
  --color-mist: #d5d3d2;
  --color-signal-red: #d04841;
  --color-network-blue: #5a82de;

  /* Typography */
  --font-inter: 'Inter', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-mdio: 'MDIO', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.5;
  --tracking-caption: 0.6px;
  --text-body-sm: 14px;
  --leading-body-sm: 1.43;
  --text-body: 16px;
  --leading-body: 1.5;
  --text-subheading: 20px;
  --leading-subheading: 1.5;
  --tracking-subheading: -0.2px;
  --text-heading: 32px;
  --leading-heading: 1.2;
  --tracking-heading: -0.64px;
  --text-heading-lg: 48px;
  --leading-heading-lg: 1.2;
  --tracking-heading-lg: -0.96px;
  --text-display: 64px;
  --leading-display: 1.2;
  --tracking-display: -1.92px;

  /* Spacing */
  --spacing-4: 4px;
  --spacing-8: 8px;
  --spacing-12: 12px;
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-48: 48px;
  --spacing-64: 64px;
  --spacing-84: 84px;
  --spacing-168: 168px;

  /* Border Radius */
  --radius-lg: 8px;
  --radius-2xl: 16px;
  --radius-3xl: 32px;
  --radius-full: 9999px;

  /* Shadows */
  --shadow-sm: rgba(24, 23, 23, 0.02) 0px 4px 8px 0px;
  --shadow-md: rgba(24, 23, 23, 0.16) 0px 4px 16px 0px;
}
```
