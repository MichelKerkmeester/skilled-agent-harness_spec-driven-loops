# Josh Warner — Style Reference
> black void gallery wall

**Theme:** dark

Josh Warner's portfolio operates as a near-pure black gallery wall: the interface recedes so that 3D renders, product mockups, and photographic compositions can dominate every viewport. Typography is whisper-thin and uniformly weighted at 400 across the scale, using a single sans-serif family that refuses to shout — hierarchy is built through size and generous letter-spacing (0.04em) rather than weight contrast. The entire palette is achromatic except for a single electric green status dot (#08ff00), which functions as the site's only living signal against the void. Surfaces are flat or near-flat; depth is borrowed entirely from the artwork, not from drop shadows or gradients. Components are sparse, pill-shaped, and almost weightless — ghost buttons, hairline borders on #000, circular avatars, and pill nav items. The system is a frame, not a subject.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Void | `#0f0f0f` | `--color-void` | Page canvas and primary surface — the base layer beneath all artwork, slightly lifted from pure black to prevent OLED banding in the dark void |
| Absolute | `#000000` | `--color-absolute` | Hairline borders, image containers, icon strokes, footer dividers — pure black acts as the structural ink that defines edges in the absence of visible card surfaces |
| Charcoal | `#1a1a1a` | `--color-charcoal` | Elevated footer surface and deeper UI panels — a single step up from canvas for zone separation without breaking the dark void |
| Faint | `#080808` | `--color-faint` | Shadow base for subtle elevation effects — nearly invisible against canvas, used in box-shadow compositions for soft ambient lift |
| Bone | `#f0f0f0` | `--color-bone` | Primary text color, nav item fills, filled button background — warm off-white replaces pure white to soften contrast against the black void and reduce eye strain |
| Ash | `#b8b8b8` | `--color-ash` | Secondary body text, subdued helper labels, muted metadata — sits one step below Bone for non-emphasized copy without losing legibility on dark surfaces |
| Graphite | `#696969` | `--color-graphite` | Tertiary text and border accents on headings — used sparingly for fine print and inactive labels that should recede |
| Live Wire | `#08ff00` | `--color-live-wire` | Green wash for highlight backgrounds, decorative bands, and soft emphasis behind content |

## Tokens — Typography

### Inter Display — Primary typeface across all UI, body, navigation, and headings — used exclusively at weight 400 with no weight variation, creating a flat, even visual texture where size and spacing alone carry hierarchy. Substitute with Inter (free, near-identical metrics). · `--font-inter-display`
- **Substitute:** Inter
- **Weights:** 400
- **Sizes:** 14px, 16px, 20px, 32px, 40px
- **Line height:** 1.00-1.56
- **Letter spacing:** 0.04em
- **Role:** Primary typeface across all UI, body, navigation, and headings — used exclusively at weight 400 with no weight variation, creating a flat, even visual texture where size and spacing alone carry hierarchy. Substitute with Inter (free, near-identical metrics).

### System sans-serif — Micro-UI labels (12px) — system stack for the smallest utility text where font loading overhead isn't justified · `--font-system-sans-serif`
- **Substitute:** -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif
- **Weights:** 400
- **Sizes:** 12px
- **Line height:** 1.20
- **Letter spacing:** normal
- **Role:** Micro-UI labels (12px) — system stack for the smallest utility text where font loading overhead isn't justified

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 12px | 1.2 | 0.48px | `--text-caption` |
| body-sm | 14px | 1.43 | 0.56px | `--text-body-sm` |
| body | 16px | 1.5 | 0.64px | `--text-body` |
| subheading | 20px | 1.4 | 0.8px | `--text-subheading` |
| heading | 32px | 1.25 | 1.28px | `--text-heading` |
| display | 40px | 1.2 | 1.6px | `--text-display` |

## Tokens — Spacing & Shapes

**Density:** compact

### Spacing Scale

| Name | Value | Token |
|------|-------|-------|
| 4 | 4px | `--spacing-4` |
| 6 | 6px | `--spacing-6` |
| 8 | 8px | `--spacing-8` |
| 10 | 10px | `--spacing-10` |
| 12 | 12px | `--spacing-12` |
| 14 | 14px | `--spacing-14` |
| 16 | 16px | `--spacing-16` |
| 20 | 20px | `--spacing-20` |
| 24 | 24px | `--spacing-24` |
| 28 | 28px | `--spacing-28` |
| 60 | 60px | `--spacing-60` |
| 64 | 64px | `--spacing-64` |

### Border Radius

| Element | Value |
|---------|-------|
| badges | 100px |
| images | 4px |
| avatars | 100px |
| buttons | 100px |
| navPills | 100px |

### Shadows

| Name | Value | Token |
|------|-------|-------|
| md | `rgba(0, 0, 0, 0.5) 0px 1px 10px -2px` | `--shadow-md` |
| md-2 | `rgba(0, 0, 0, 0.16) 0px 0px 10px 0px` | `--shadow-md-2` |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 60-64px
- **Card padding:** 14px
- **Element gap:** 10px

## Components

### Pill Navigation Button
**Role:** Top-center nav items (Projects, Art, Info) and ghost nav controls

Ghost-style button: transparent background, Bone (#f0f0f0) text at 14-16px Inter Display 400 with 0.04em letter-spacing, 100px border-radius, 4px vertical / 14px horizontal padding, no visible border. Active state (Art in screenshots) indicated by a subtle underline or text emphasis rather than a fill change.

### Filled CTA Button
**Role:** Primary action — Contact, Hire me

Bone (#f0f0f0) fill, Void (#0f0f0f) text at 14-16px Inter Display 400, 100px border-radius, 6px vertical / 14px horizontal padding. No border, no shadow. The only filled button in the system — reserved for actions the user must see.

### Status Indicator
**Role:** Availability signal in footer/hero

6-8px circular dot in Live Wire (#08ff00) with optional text label ('Available for hire') in Bone at 14px. The green dot is the sole chromatic element in the entire UI — a heartbeat against the void.

### Avatar Badge
**Role:** Brand identity mark in top-left nav

Circular thumbnail (100px radius) of the designer's portrait, 32-40px diameter, no border. Paired with 'Josh Warner' wordmark in Bone at 14-16px Inter Display 400.

### Coming Soon Pill
**Role:** Project status badge on case study previews

Ghost pill: transparent background, Bone text 'Coming Soon' at 12px, 100px radius, 4px vertical / 10px horizontal padding. Communicates temporal state through the nav pill language rather than introducing a new component family.

### Hero Art Container
**Role:** Full-bleed 3D render or photographic artwork

No container chrome — artwork extends to viewport edges against Void (#0f0f0f) canvas. The hero is a single large composition (golden ampersands + driftwood in screenshots) that occupies the full viewport height with overlaid nav and tagline.

### Project Showcase Panel
**Role:** Individual case study preview (phone mockup in second screenshot)

Device mockup centered or positioned within the viewport, floating over continuation of the hero artwork. No card surface, no border — the device image itself is the visual unit. Caption text overlays in Bone at 16-20px.

### Footer Bar
**Role:** Site footer with bio and CTA

Charcoal (#1a1a1a) background, one step above canvas. Contains status indicator on left, bio text in Bone/Ash at 14-16px, and Hire me button on right. 12px padding, hairline top border in Absolute (#000000).

### Tagline Headline
**Role:** Hero left-aligned copy block

Two-line statement ('Product by day. / Art by night.') at 32-40px Inter Display 400, Bone (#f0f0f0), 0.04em letter-spacing, positioned in lower-left of hero with generous left margin. No bold, no gradient — the weight of the line comes from its placement against the dark void.

### Subtitle/Body Text
**Role:** Supporting paragraph text

14-16px Inter Display 400, Ash (#b8b8b8) or Bone (#f0f0f0), 0.04em letter-spacing, 1.5-1.56 line-height. Restrained, readable, never decorative.

### Image Thumbnail
**Role:** Small image containers and inline media

4px border-radius, Absolute (#000000) 1px border. The tight radius keeps images grounded and sharp against the void, contrasting with the 100px pill language of interactive elements.

## Do's and Don'ts

### Do
- Use Bone (#f0f0f0) for all text on the dark void — never use pure white, which clashes with the warm off-white palette
- Apply 100px border-radius to every interactive button, badge, nav item, and avatar — the pill shape is the system's signature geometry
- Keep all type at Inter Display weight 400 — never introduce bold or semibold weights; build hierarchy through size and spacing only
- Use 0.04em letter-spacing on all text — this consistent positive tracking is what makes the whisper-weight type legible and gives the system its measured, deliberate feel
- Reserve Live Wire (#08ff00) exclusively for the availability status dot — it is the only chromatic color and must appear nowhere else
- Set page backgrounds to Void (#0f0f0f), not pure black — the near-black prevents OLED smearing and creates a subtle canvas depth
- Use 4px border-radius for image containers and 100px for all interactive elements — maintain the sharp/round duality

### Don't
- Don't introduce any new accent colors beyond Live Wire green — the system is deliberately monochromatic and any additional hue will break the gallery void
- Don't use drop shadows for card or surface elevation — depth must come from the artwork itself or surface tone shifts, not from shadow stacks
- Don't bold headlines or use weight 500+ — the entire type system breathes at weight 400; adding weight disrupts the flat, even texture
- Don't use sharp corners (<12px) on buttons, nav items, or badges — the pill geometry is the system's visual identity
- Don't use pure black (#000000) as a fill background for cards or surfaces — reserve it for hairline borders and edges; use Void (#0f0f0f) for surfaces
- Don't place body text below 14px or above 40px — the type scale is deliberately compressed; deviation breaks the editorial restraint
- Don't add gradients, glows, or color washes to UI elements — the system's visual energy comes from the 3D/photographic content, not from UI decoration

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Void | `#0f0f0f` | Page canvas — the base layer beneath all content |
| 1 | Charcoal | `#1a1a1a` | Footer surface — one step above canvas for zone separation |
| 2 | Bone | `#f0f0f0` | Filled button background — inverted surface for interactive emphasis |

## Elevation

- **Buttons and interactive elements:** `rgba(0, 0, 0, 0.16) 0px 0px 10px 0px`
- **Project images and artwork overlays:** `rgba(0, 0, 0, 0.5) 0px 1px 10px -2px`

## Imagery

The site is image-dominant: full-bleed 3D renders and high-end photography occupy the entire viewport. The hero features a sculptural composition of metallic golden ampersand letterforms intertwined with organic driftwood, a small flower, and ornate keys — studio-lit, high-contrast, against a pure black backdrop. Secondary sections show device mockups (iPhone displaying app UI) floating over continuation of the driftwood scene, creating a unified visual world across scroll. All imagery is photographic or 3D-rendered, never illustrated or flat. Color treatment in photography is moody and warm — golden metallics, warm wood tones, against deep black. No icons are used; navigation and status are text-only. Images have tight 4px corners, contrasting with the pill-shaped UI chrome.

## Layout

Full-bleed dark canvas with no visible page max-width constraint — the hero artwork extends edge-to-edge, and text overlays float in negative space (lower-left for the tagline, center for nav). Navigation is a single horizontal bar with brand avatar+name on far left, three nav items (Projects, Art, Info) clustered in center, and a Contact button on far right. Below the hero, the page flows into full-viewport project showcase panels, each featuring a device mockup or artwork composition centered or slightly off-center, with minimal text overlay. Footer is a single horizontal band with status indicator left-aligned, bio center-left, and CTA right-aligned. Vertical rhythm is defined by 60-64px section gaps, and the overall density is compact with generous breathing room around text overlays. The layout is editorial and gallery-like — content sections are separated by the artwork itself rather than by dividers or background color changes.

## Agent Prompt Guide

## Quick Color Reference
- background (canvas): #0f0f0f
- text (primary): #f0f0f0
- text (secondary): #b8b8b8
- border (hairline): #000000
- accent (status dot only): #08ff00
- primary action: #f0f0f0 (filled action)

## 3-5 Example Component Prompts

1. **Pill Navigation Button (ghost):** Transparent background, 14px Inter Display weight 400, color #f0f0f0, letter-spacing 0.04em, border-radius 100px, padding 4px 14px. No border, no shadow.

2. **Filled Contact Button:** Background #f0f0f0, text 14px Inter Display weight 400, color #0f0f0f, letter-spacing 0.04em, border-radius 100px, padding 6px 14px. No border.

3. **Status Indicator Row:** 8px circular dot in #08ff00, followed by label text 'Available for hire' at 14px Inter Display 400, color #f0f0f0, letter-spacing 0.04em. Inline-flex with 8px gap.

4. **Hero Tagline Block:** Two-line headline at 32-40px Inter Display weight 400, color #f0f0f0, letter-spacing 0.04em, positioned in lower-left viewport. Subtitle below at 16px, color #b8b8b8, same letter-spacing.

5. **Footer Bar:** Background #1a1a1a, full-width, 12px padding. Status indicator on left, bio text in #f0f0f0 at 14px, 'Hire me' filled button (Bone fill, Void text, 100px radius) on right.

## Similar Brands

- **Are.na** — Same achromatic dark gallery approach with whisper-weight sans-serif and zero decorative color — content as the visual subject against a near-black void
- **Locomotive (locomotive.ca)** — Full-bleed 3D-rendered hero compositions against deep black canvas, with pill-shaped minimal nav and editorial-scale typography
- **Werkstatt (by Studio Apeloig)** — Portfolio-as-art-gallery language: large sculptural imagery dominates, UI is reduced to text labels and pill controls, single-color palette
- **Rauno Freiberg** — Dark-mode developer portfolio with weight-400-only type, generous letter-spacing, and near-monochromatic palette where color is reserved for a single functional signal

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-void: #0f0f0f;
  --color-absolute: #000000;
  --color-charcoal: #1a1a1a;
  --color-faint: #080808;
  --color-bone: #f0f0f0;
  --color-ash: #b8b8b8;
  --color-graphite: #696969;
  --color-live-wire: #08ff00;

  /* Typography — Font Families */
  --font-inter-display: 'Inter Display', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-system-sans-serif: 'System sans-serif', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.2;
  --tracking-caption: 0.48px;
  --text-body-sm: 14px;
  --leading-body-sm: 1.43;
  --tracking-body-sm: 0.56px;
  --text-body: 16px;
  --leading-body: 1.5;
  --tracking-body: 0.64px;
  --text-subheading: 20px;
  --leading-subheading: 1.4;
  --tracking-subheading: 0.8px;
  --text-heading: 32px;
  --leading-heading: 1.25;
  --tracking-heading: 1.28px;
  --text-display: 40px;
  --leading-display: 1.2;
  --tracking-display: 1.6px;

  /* Typography — Weights */
  --font-weight-regular: 400;

  /* Spacing */
  --spacing-4: 4px;
  --spacing-6: 6px;
  --spacing-8: 8px;
  --spacing-10: 10px;
  --spacing-12: 12px;
  --spacing-14: 14px;
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-28: 28px;
  --spacing-60: 60px;
  --spacing-64: 64px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 60-64px;
  --card-padding: 14px;
  --element-gap: 10px;

  /* Border Radius */
  --radius-md: 4px;
  --radius-lg: 8px;
  --radius-xl: 12px;
  --radius-3xl: 40px;
  --radius-full: 100px;

  /* Named Radii */
  --radius-badges: 100px;
  --radius-images: 4px;
  --radius-avatars: 100px;
  --radius-buttons: 100px;
  --radius-navpills: 100px;

  /* Shadows */
  --shadow-md: rgba(0, 0, 0, 0.5) 0px 1px 10px -2px;
  --shadow-md-2: rgba(0, 0, 0, 0.16) 0px 0px 10px 0px;

  /* Surfaces */
  --surface-void: #0f0f0f;
  --surface-charcoal: #1a1a1a;
  --surface-bone: #f0f0f0;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-void: #0f0f0f;
  --color-absolute: #000000;
  --color-charcoal: #1a1a1a;
  --color-faint: #080808;
  --color-bone: #f0f0f0;
  --color-ash: #b8b8b8;
  --color-graphite: #696969;
  --color-live-wire: #08ff00;

  /* Typography */
  --font-inter-display: 'Inter Display', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-system-sans-serif: 'System sans-serif', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.2;
  --tracking-caption: 0.48px;
  --text-body-sm: 14px;
  --leading-body-sm: 1.43;
  --tracking-body-sm: 0.56px;
  --text-body: 16px;
  --leading-body: 1.5;
  --tracking-body: 0.64px;
  --text-subheading: 20px;
  --leading-subheading: 1.4;
  --tracking-subheading: 0.8px;
  --text-heading: 32px;
  --leading-heading: 1.25;
  --tracking-heading: 1.28px;
  --text-display: 40px;
  --leading-display: 1.2;
  --tracking-display: 1.6px;

  /* Spacing */
  --spacing-4: 4px;
  --spacing-6: 6px;
  --spacing-8: 8px;
  --spacing-10: 10px;
  --spacing-12: 12px;
  --spacing-14: 14px;
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-28: 28px;
  --spacing-60: 60px;
  --spacing-64: 64px;

  /* Border Radius */
  --radius-md: 4px;
  --radius-lg: 8px;
  --radius-xl: 12px;
  --radius-3xl: 40px;
  --radius-full: 100px;

  /* Shadows */
  --shadow-md: rgba(0, 0, 0, 0.5) 0px 1px 10px -2px;
  --shadow-md-2: rgba(0, 0, 0, 0.16) 0px 0px 10px 0px;
}
```
