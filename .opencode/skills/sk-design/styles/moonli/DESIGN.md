# Moonli — Style Reference
> Electric lime on white canvas — one vivid room carved out of monochrome space, framed by generous rounded edges.

**Theme:** light

Moonli runs on radical color minimalism: a white canvas, black type, and one electrifying lime accent that appears as a single massive atmospheric block rather than scattered UI elements. The lime (#b8ff65) functions as a room, not a highlight — it floods the hero entirely and reappears in section backgrounds, never as a button fill or icon tint. Everything else is pure black-on-white, anchored by generous 30-40px border radii that soften the stark monochrome contrast. DM Sans carries the entire typographic system across a wide weight range, with tight letter-spacing that scales aggressively negative at display sizes (-0.05em at 58px). Line illustrations in black on the green surfaces add personality and warmth without breaking the two-color discipline. The result reads as confident, almost poster-like — like a single bright object in a gallery of white walls.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Lime Voltage | `#b8ff65` | `--color-lime-voltage` | Atmospheric section backgrounds, hero block — the single chromatic voice of the system, used at full-section scale rather than as UI accent |
| Obsidian | `#000000` | `--color-obsidian` | Primary text, all borders, all icons, scroll-indicator fill, logo mark |
| Paper White | `#ffffff` | `--color-paper-white` | Page background, card surfaces, nav element fills |
| Fog White | `#f3f3f3` | `--color-fog-white` | Secondary card surface, alternating section backgrounds |
| Ash Border | `#e2e2e2` | `--color-ash-border` | Card borders, hairline dividers on white surfaces |
| Smoke | `#757575` | `--color-smoke` | Muted helper text, secondary metadata, caption-level information |

## Tokens — Typography

### DM Sans — Sole typeface — weight 700 for display and headings, 500 for navigation and subheadings, 400 for body and captions. The aggressive negative tracking at display sizes (-0.05em at 58px) is signature: DM Sans becomes a compressed, poster-like headline tool rather than a neutral body face. At body sizes tracking relaxes to -0.01em, giving copy a natural rhythm without feeling mechanical. · `--font-dm-sans`
- **Substitute:** Inter, Satoshi, General Sans
- **Weights:** 400, 500, 700
- **Sizes:** 14px, 16px, 24px, 38px, 48px, 58px
- **Line height:** 1.08 (display), 1.13–1.17 (large headings), 1.26 (subheadings), 1.45–1.50 (body), 1.75 (body-sm/captions)
- **Letter spacing:** -0.05em at 58px, -0.03em at 38–48px, -0.01em at 14–24px
- **Role:** Sole typeface — weight 700 for display and headings, 500 for navigation and subheadings, 400 for body and captions. The aggressive negative tracking at display sizes (-0.05em at 58px) is signature: DM Sans becomes a compressed, poster-like headline tool rather than a neutral body face. At body sizes tracking relaxes to -0.01em, giving copy a natural rhythm without feeling mechanical.

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 14px | 1.75 | — | `--text-caption` |
| body-sm | 16px | 1.5 | — | `--text-body-sm` |
| subheading | 24px | 1.26 | — | `--text-subheading` |
| heading-sm | 38px | 1.17 | — | `--text-heading-sm` |
| heading | 48px | 1.13 | — | `--text-heading` |
| display | 58px | 1.08 | — | `--text-display` |

## Tokens — Spacing & Shapes

**Base unit:** 4px

**Density:** comfortable

### Spacing Scale

| Name | Value | Token |
|------|-------|-------|
| 12 | 12px | `--spacing-12` |
| 16 | 16px | `--spacing-16` |
| 20 | 20px | `--spacing-20` |
| 40 | 40px | `--spacing-40` |
| 60 | 60px | `--spacing-60` |
| 80 | 80px | `--spacing-80` |
| 100 | 100px | `--spacing-100` |
| 120 | 120px | `--spacing-120` |
| 184 | 184px | `--spacing-184` |
| 200 | 200px | `--spacing-200` |

### Border Radius

| Element | Value |
|---------|-------|
| nav | 40px |
| cards | 30px |
| buttons | 40px |
| circles | 9999px |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 40-70px
- **Card padding:** 30-40px
- **Element gap:** 20-25px

## Components

### Lime Hero Block
**Role:** Primary hero — full-width atmospheric section

Full-width #b8ff65 background, 30px border-radius, padded 40-70px. Black DM Sans 58px/1.08/weight 700/letter-spacing -0.05em headline centered or left-aligned. Black line illustrations flanking the text on left and right. Black body copy at 16px/1.5 underneath.

### White Content Card
**Role:** Standard surface for information blocks

#ffffff background, 1px #e2e2e2 border, 30px border-radius, 30-40px padding. Contains black headings at 38-48px and body at 16px.

### Network Logo Card
**Role:** Horizontal scroll card showing a blockchain network

#ffffff background, 1px #e2e2e2 border, 30px border-radius, 20px padding. Network name in DM Sans 500 at 24px, logo icon as circular 48-56px element on the right side.

### Charity Circle
**Role:** Circular badge for charity/cause logos in the Giving Back section

Perfect circle (9999px radius), #f3f3f3 background, black logo inside at ~50% fill. Arranged in grid.

### Nav Pill Button
**Role:** Primary navigation CTA (Stake Now)

#ffffff background, 1px #e2e2e2 border, 40px border-radius, 12px vertical / 20px horizontal padding. Text in DM Sans 500 at 16px, #000000.

### Ghost Nav Link
**Role:** Standard navigation text item

No background, no border. DM Sans 500 at 16px, #000000. Horizontal spacing 25px between items.

### Scroll-Down Indicator
**Role:** Floating circular button prompting scroll

#000000 fill, perfect circle (~48px), white chevron icon centered. Positioned overlapping section boundary.

### Two-Column Feature Section
**Role:** Giving Back and similar split layouts

Lime green left column (#b8ff65) paired with Fog White right column (#f3f3f3), both 30px border-radius. Left holds heading + body + illustration; right holds logo grid + supporting copy.

### Logo Mark
**Role:** Brand identity in nav and footer

Black circular icon (~36px) containing a white abstract curve mark, followed by 'moonli' wordmark in DM Sans 500 at ~20px, #000000.

### Line Illustration Block
**Role:** Decorative visual on green surfaces

Black single-weight line art depicting 3D objects (books, coins, monitors, crystals). Drawn at ~1.5px stroke, no fill. Positioned at edges of lime sections.

## Do's and Don'ts

### Do
- Use #b8ff65 only as a full-section or full-card background — never as a button fill, text color, or icon tint
- Apply 30px border-radius to all cards and 40px to all nav-pill elements
- Use DM Sans 700 with letter-spacing -0.05em for any text at 48px or above
- Keep all icons, borders, and text #000000 — the system is binary between black and white, with lime as the only third voice
- Use line illustrations (single-weight black strokes, no fill) to add personality on lime surfaces
- Pair sections as adjacent rounded blocks rather than separating with dividers — the 30px radius and color contrast create the structure
- Center the page at ~1200px max-width; let white margins breathe

### Don't
- Never use #b8ff65 as a CTA button background or link color — the lime is atmospheric, not interactive
- Avoid introducing additional chromatic colors — no blues, purples, or status hues. The system is two-tone plus lime
- Don't apply shadows or gradients — the design is strictly flat with border-defined elevation
- Avoid sharp corners below 30px on cards or containers — small radii break the system's softness
- Don't use letter-spacing looser than -0.01em at body sizes or tighter than -0.05em at display
- Never place lime text on white or white text on lime at small sizes — keep it large to preserve the 17.5:1 contrast
- Avoid photographic imagery, gradients, or filled illustrations — line art in black is the only visual language

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Paper White | `#ffffff` | Page canvas, nav background |
| 1 | Fog White | `#f3f3f3` | Secondary card surface, alternating sections |
| 2 | Lime Voltage | `#b8ff65` | Atmospheric hero and feature block backgrounds |

## Elevation

No shadows. Elevation is expressed through border color (1px #e2e2e2) and surface color shifts (white → fog → lime). The system is strictly flat; depth comes from layering rounded blocks, not from drop shadows.

## Imagery

No photography. All visuals are hand-drawn line illustrations in single-weight black strokes (approximately 1.5px) depicting geometric 3D objects — monitors, coins, books, crystals, pyramids, coins on stacks. Illustrations sit on lime backgrounds and function as atmospheric decoration rather than explanatory content. Third-party logos (network chains, charities) appear as small monochrome marks inside circular or pill containers. The visual density is low — illustrations occupy generous negative space and never overlap or crowd the typography.

## Layout

Centered, max-width ~1200px contained layout. The hero is a full-width lime block with centered headline and flanking line illustrations. Below, a horizontally scrolling row of network cards (#ffffff, 30px radius) sits inside a fog-white container. Two-column sections follow a repeating pattern: one lime column paired with one fog-white column, each 30px radius, creating a yin-yang rhythm. Generous vertical spacing (40-70px between sections). Navigation is a minimal top bar with a pill-shaped CTA on the right. The overall density is spacious — white space dominates, with content blocks floating as discrete rounded cards rather than filling the page edge-to-edge.

## Agent Prompt Guide

**Quick Color Reference**
- text: #000000
- background: #ffffff
- surface: #f3f3f3
- border: #e2e2e2
- accent (atmospheric only): #b8ff65
- primary action: no distinct CTA color

**Example Component Prompts**

1. Create a hero section: full-width #b8ff65 background, 30px border-radius, 60px vertical padding. Headline at 58px DM Sans weight 700, #000000, letter-spacing -0.05em, line-height 1.08. Subtext at 16px DM Sans weight 400, #000000, line-height 1.5. Black single-stroke line illustrations flanking the text.

2. Create a network card: #ffffff background, 1px #e2e2e2 border, 30px border-radius, 20px padding. Network name at 24px DM Sans weight 500, #000000. Circular logo icon (48px) on the right side.

3. Create a nav bar: #ffffff background, centered at 1200px max-width. Logo (black circle + 'moonli' wordmark in DM Sans 500) on the left. Nav links at 16px DM Sans weight 500, #000000, 25px horizontal spacing. 'Stake Now' button on the right: #ffffff background, 1px #e2e2e2 border, 40px border-radius, 12px 20px padding, DM Sans 500 at 16px.

4. Create a two-column feature block: left column #b8ff65 with 30px border-radius, right column #f3f3f3 with 30px border-radius. Left column has 38px DM Sans 700 heading + 16px body + black line illustration. Right column has a 3×2 grid of charity circles (#f3f3f3 background, perfect circle, black logo inside).

5. Create a scroll-down indicator: 48px perfect circle, #000000 fill, white chevron-down icon centered. Positioned overlapping the boundary between the lime hero and the next white section.

## Similar Brands

- **Linear** — Same ultra-minimal palette discipline with one accent color, generous rounded corners, and tight letter-spacing on display headings
- **Evervault** — Similar poster-like hero blocks with full-bleed color washes and bold sans-serif display type
- **Ledger (corporate site)** — Same crypto/blockchain domain with stark monochrome UI and rounded card surfaces
- **Cove** — Shared two-tone aesthetic (white + single vivid accent) with large border-radius and confident display type

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-lime-voltage: #b8ff65;
  --color-obsidian: #000000;
  --color-paper-white: #ffffff;
  --color-fog-white: #f3f3f3;
  --color-ash-border: #e2e2e2;
  --color-smoke: #757575;

  /* Typography — Font Families */
  --font-dm-sans: 'DM Sans', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 14px;
  --leading-caption: 1.75;
  --text-body-sm: 16px;
  --leading-body-sm: 1.5;
  --text-subheading: 24px;
  --leading-subheading: 1.26;
  --text-heading-sm: 38px;
  --leading-heading-sm: 1.17;
  --text-heading: 48px;
  --leading-heading: 1.13;
  --text-display: 58px;
  --leading-display: 1.08;

  /* Typography — Weights */
  --font-weight-regular: 400;
  --font-weight-medium: 500;
  --font-weight-bold: 700;

  /* Spacing */
  --spacing-unit: 4px;
  --spacing-12: 12px;
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-40: 40px;
  --spacing-60: 60px;
  --spacing-80: 80px;
  --spacing-100: 100px;
  --spacing-120: 120px;
  --spacing-184: 184px;
  --spacing-200: 200px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 40-70px;
  --card-padding: 30-40px;
  --element-gap: 20-25px;

  /* Border Radius */
  --radius-3xl: 30px;
  --radius-3xl-2: 40px;

  /* Named Radii */
  --radius-nav: 40px;
  --radius-cards: 30px;
  --radius-buttons: 40px;
  --radius-circles: 9999px;

  /* Surfaces */
  --surface-paper-white: #ffffff;
  --surface-fog-white: #f3f3f3;
  --surface-lime-voltage: #b8ff65;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-lime-voltage: #b8ff65;
  --color-obsidian: #000000;
  --color-paper-white: #ffffff;
  --color-fog-white: #f3f3f3;
  --color-ash-border: #e2e2e2;
  --color-smoke: #757575;

  /* Typography */
  --font-dm-sans: 'DM Sans', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 14px;
  --leading-caption: 1.75;
  --text-body-sm: 16px;
  --leading-body-sm: 1.5;
  --text-subheading: 24px;
  --leading-subheading: 1.26;
  --text-heading-sm: 38px;
  --leading-heading-sm: 1.17;
  --text-heading: 48px;
  --leading-heading: 1.13;
  --text-display: 58px;
  --leading-display: 1.08;

  /* Spacing */
  --spacing-12: 12px;
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-40: 40px;
  --spacing-60: 60px;
  --spacing-80: 80px;
  --spacing-100: 100px;
  --spacing-120: 120px;
  --spacing-184: 184px;
  --spacing-200: 200px;

  /* Border Radius */
  --radius-3xl: 30px;
  --radius-3xl-2: 40px;
}
```
