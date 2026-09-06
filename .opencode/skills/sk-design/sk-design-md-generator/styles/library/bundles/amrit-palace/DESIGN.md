# Amrit Palace — Style Reference
> spiced parchment gallery — a candlelit beige wall holding sparse saffron punctuation beneath breath-soft serif headlines.

**Theme:** light

Amrit Palace treats the screen like a curated dining room: a warm beige parchment canvas (#d8cbb8) carries the entire interface, accented only by a single saffron-orange moment (#d49653) and grounded by deep warm-black type (#2c2c2c). Typography carries the luxury — whisper-weight 300 headlines reaching 115px in a serif display face, paired with confident 500-weight sans-serif for navigation, buttons, and body, set uppercase with tight negative tracking. Geometry is deliberately sharp: zero border-radius on cards, 1px hairline borders dividing sections like editorial column rules, 3px on interactive elements. Full-bleed atmospheric photography with dark overlays bookends the page, while the lower half unfolds as a wide editorial spread on the warm canvas.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Parchment | `#d8cbb8` | `--color-parchment` | Page canvas and primary card surfaces — the warm beige that carries the entire interface |
| Linen | `#bfb4a3` | `--color-linen` | Secondary surface tone for elevated sections and subtle layering above parchment |
| Warm Stone | `#b6ab9c` | `--color-warm-stone` | Hairline borders and 1px section dividers throughout the interface |
| Walnut | `#978e81` | `--color-walnut` | Muted helper text, captions, and de-emphasized metadata |
| Espresso | `#615b53` | `--color-espresso` | Secondary body text and subhead copy — warm dark gray that softens pure black |
| Onyx Warm | `#2c2c2c` | `--color-onyx-warm` | Primary text, navigation, headings, and dark surface fills |
| Midnight Roast | `#292622` | `--color-midnight-roast` | Deepest dark surface for photo overlays and high-contrast hero backgrounds |
| Saffron Glow | `#d49653` | `--color-saffron-glow` | Sole chromatic accent — featured tags, active states, decorative punctuation; warm spice-orange against the beige canvas creates curated restraint |

## Tokens — Typography

### TT Ramillas Variable — All display and section headings — set uppercase at extreme sizes with weight 300; the whisper-weight serif at 115px is the signature anti-convention choice, creating editorial luxury through restraint rather than bold volume · `--font-tt-ramillas-variable`
- **Substitute:** Cormorant Garamond, Playfair Display, or DM Serif Display
- **Weights:** 300
- **Sizes:** 22px, 26px, 50px, 65px, 69px, 115px
- **Line height:** 0.80, 0.85, 0.90, 1.00, 1.20
- **Letter spacing:** -0.0400em at display sizes (115px/69px/65px), -0.0300em at 50px, -0.0350em at 22px, -0.0060em at 26px
- **Role:** All display and section headings — set uppercase at extreme sizes with weight 300; the whisper-weight serif at 115px is the signature anti-convention choice, creating editorial luxury through restraint rather than bold volume

### Satoshi — Navigation, buttons, body copy, labels, and the 199px hero wordmark — confident 500-weight geometric sans provides structural counterpoint to the airy serif · `--font-satoshi`
- **Substitute:** Inter, DM Sans, or Manrope
- **Weights:** 500, 700
- **Sizes:** 12px, 13px, 14px, 15px, 42px, 199px
- **Line height:** 0.80, 1.00, 1.30, 1.40
- **Letter spacing:** -0.0160em at 199px, -0.0400em at 42px, -0.0100em at 14px/15px, -0.0110em at 13px, -0.0120em at 12px
- **Role:** Navigation, buttons, body copy, labels, and the 199px hero wordmark — confident 500-weight geometric sans provides structural counterpoint to the airy serif

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 13px | 1.3 | -0.143px | `--text-caption` |
| body | 15px | 1.4 | -0.15px | `--text-body` |
| body-lg | 26px | 1.2 | -0.156px | `--text-body-lg` |
| subheading | 42px | 1 | -1.68px | `--text-subheading` |
| heading-sm | 50px | 0.9 | -1.5px | `--text-heading-sm` |
| heading | 65px | 0.85 | -2.6px | `--text-heading` |
| heading-lg | 69px | 0.9 | -2.76px | `--text-heading-lg` |
| display | 115px | 0.8 | -4.6px | `--text-display` |

## Tokens — Spacing & Shapes

**Density:** compact

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
| 16 | 16px | `--spacing-16` |
| 17 | 17px | `--spacing-17` |
| 20 | 20px | `--spacing-20` |
| 24 | 24px | `--spacing-24` |
| 28 | 28px | `--spacing-28` |
| 32 | 32px | `--spacing-32` |
| 42 | 42px | `--spacing-42` |
| 92 | 92px | `--spacing-92` |
| 206 | 206px | `--spacing-206` |

### Border Radius

| Element | Value |
|---------|-------|
| tags | 3px |
| cards | 0px |
| inputs | 3px |
| buttons | 3px |

### Layout

- **Page max-width:** 1440px
- **Section gap:** 120-160px
- **Card padding:** 28px
- **Element gap:** 12-16px

## Components

### Ghost Outlined Button
**Role:** Primary interactive element for navigation and hero CTAs

Transparent background, 1px solid #d8cbb8 border (or #2c2c2c on light sections), text in #d8cbb8 on dark overlays / #2c2c2c on light canvas. Satoshi 500, 14px, uppercase, letter-spacing -0.14px. Padding 20px horizontal, 20px vertical. Border-radius 3px. No shadow.

### Text Link Button
**Role:** Inline navigation and tertiary actions

No background or border. Text-only with underline-on-hover. Satoshi 500, 13-15px, uppercase. Color follows context: #d8cbb8 on dark overlays, #2c2c2c on light sections.

### Hero Wordmark Display
**Role:** Signature typographic statement on hero

Satoshi 500, 199px, line-height 0.8, letter-spacing -0.0160em, uppercase. Color #d8cbb8. Sits over dark photographic overlay as the opening brand moment.

### Editorial Section Heading
**Role:** Section titles throughout the page

TT Ramillas Variable 300, 50-115px range depending on section prominence, uppercase, line-height 0.8-0.9, letter-spacing -0.0400em to -0.0300em. Color #d8cbb8 on dark sections, #2c2c2c on light. The whisper-weight serif at extreme size is the signature choice.

### Testimonial Card
**Role:** Guest review display

Background #d8cbb8 (same as canvas, no contrast elevation). Border-radius 0px. Padding 52px top, 28px sides, 32px bottom. No shadow, no border. Content: 5-star rating row in #d49653, review body in Satoshi 500 14px #2c2c2c, source attribution (Yelp/Reddit/Maps) in micro caps top-right, author name in #978e81.

### Image Overlay Container
**Role:** Full-bleed atmospheric photography with text

Full-viewport image with dark gradient overlay (linear darkening from transparent to rgba(41,38,34,0.7+)). Text content sits top-left or centered in #d8cbb8. Used for hero and atmospheric transition sections.

### Star Rating Display
**Role:** Google review score and star indicators

5 filled stars in #d49653, 15px size. Numerical score (e.g. 4.7/5) in Satoshi 700 large. Source label 'Excellent' in Satoshi 500 13px. White card background with subtle border, embedded as floating widget.

### Menu Item Card
**Role:** Individual dish presentation

Transparent background. No border. Image (food photo) + dish name in TT Ramillas Variable 300 or Satoshi 500, description in body-sm. Padding 0px on container, internal spacing 16px between elements.

### Navigation Bar
**Role:** Top-level site navigation

Transparent background over hero. Left: small logo mark. Center-left: nav links (Home, Catering, Gift Cards, About, Contact) in Satoshi 500 14px uppercase, color #d8cbb8, letter-spacing -0.14px. Right: 'Menu' link, icon button (3px radius square), 'Order Now' with dropdown chevron, gift icon button. No background bar — floats over content.

### Section Divider Rule
**Role:** Editorial column-rule separator between sections

1px solid #b6ab9c horizontal line. Full-width within max-width container. No vertical padding — acts as typographic element, not structural.

### Caption Label
**Role:** Small uppercase section metadata and tags

Satoshi 500, 12px, uppercase, letter-spacing -0.144px. Color #978e81 or #d8cbb8 depending on surface. Examples: 'SERVING CENTRAL FLORIDA', 'ESTABLISHED 1996', source names on testimonial cards.

### Hero Meta Label
**Role:** Date stamp or supporting hero information

Satoshi 500, 12-14px, uppercase, letter-spacing -0.14px. Flanks the main hero heading as flanking metadata ('SERVING CENTRAL FLORIDA' left, 'ESTABLISHED 1996' right).

## Do's and Don'ts

### Do
- Set all section headings in TT Ramillas Variable at weight 300 — never bold the serif display face; the whisper weight IS the luxury
- Use uppercase + tight letter-spacing (-0.0400em to -0.0300em) on every heading 50px and above
- Reserve #d49653 saffron exclusively for star ratings, active states, and single decorative punctuation moments — it should appear on screen no more than 2-3 times per fold
- Apply 0px border-radius to all cards, sections, and image containers; reserve 3px only for buttons, tags, and interactive controls
- Use 1px solid #b6ab9c hairlines as section dividers — they function as editorial column rules, not decorative borders
- Lead with dark photographic full-bleed sections (hero + atmospheric transitions), then transition to the #d8cbb8 parchment canvas for content-heavy lower sections
- Set body text at 14px Satoshi 500 with -0.0100em tracking; never drop below 13px for readable content
- Use the marquee animation sparingly for signature dish scrolling — it is the only motion personality in the system

### Don't
- Do not round card corners — sharp geometry is signature; 0px radius everywhere except buttons
- Do not add box-shadows or elevation to cards — the system relies on flatness and hairline borders, never depth
- Do not introduce a second chromatic accent — the saffron orange stands alone against the warm neutrals
- Do not set body text above 16px or below 13px — the 14px Satoshi 500 baseline is deliberate
- Do not center-align body paragraphs — left-align for editorial column flow
- Do not use filled solid-color buttons with chromatic backgrounds — all interactive elements are ghost/outlined or text-only
- Do not use pure black (#000000) for text — always #2c2c2c to maintain the warm temperature
- Do not add gradients — the palette is flat; atmosphere comes from photography, not CSS effects
- Do not bold the TT Ramillas serif headings — weight 300 is non-negotiable; use Satoshi 700 for emphasis instead
- Do not introduce additional serif or display faces — TT Ramillas and Satoshi are the complete type system

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Parchment Canvas | `#d8cbb8` | Base page background and dominant card fill |
| 1 | Linen | `#bfb4a3` | Section tone shift and subtle elevation |
| 2 | Midnight Roast | `#292622` | Dark overlay behind hero and atmospheric photography |
| 3 | Onyx Warm | `#2c2c2c` | Navigation and highest-contrast surface |

## Elevation

The system intentionally avoids shadows and elevation. Depth is communicated through tonal shifts in the warm neutral palette (parchment #d8cbb8 → linen #bfb4a3 → walnut #978e81) and through 1px hairline borders, never through box-shadows. Components feel printed onto the surface rather than floating above it — an editorial flatness that signals fine-dining sophistication over app-like depth.

## Imagery

Full-bleed atmospheric photography dominates the upper half of the page: dark, moody restaurant interiors shot at table-height showing place settings, candles, and food in sharp focus with shallow depth of field. Tonal treatment is warm and dim — amber candlelight, rich wood, copper accents. The lower half transitions to food photography presented as editorial still-lives on the parchment canvas, with dishes styled on dark surfaces. No lifestyle imagery, no people shots, no abstract graphics. Icons are minimal — only a small ornamental logo mark and a few functional icons (gift, menu, chevrons) rendered in thin 1px strokes. The marquee element scrolls signature dish names horizontally as the sole kinetic element.

## Layout

Full-bleed sections with no centered max-width container — content extends edge-to-edge. Hero and atmospheric sections use dark photographic backgrounds with text overlaid top-left or centered. Content sections after the hero unfold on the parchment canvas with generous breathing room (120-160px section gaps). Headings and body text align left, creating an editorial column rhythm rather than centered marketing stacks. Navigation is a floating transparent bar over the hero with no visible background. The testimonials section uses a horizontal card row with sharp-cornered cards on the same-color canvas. No sidebar, no grid columns — the layout reads as a vertical scroll of editorial spreads.

## Agent Prompt Guide

Quick Color Reference:
• Canvas: #d8cbb8 (warm parchment beige)
• Dark surface: #2c2c2c / #292622 (warm onyx)
• Primary text: #2c2c2c
• Muted text: #978e81 / #615b53
• Border: #b6ab9c (1px hairline)
• Accent: #d49653 (saffron — stars, active states only)
• primary action: no distinct CTA color

3 Example Component Prompts:

1. Build a section heading: TT Ramillas Variable weight 300, 69px, uppercase, line-height 0.9, letter-spacing -2.76px, color #2c2c2c on #d8cbb8 canvas. No border, no background.

2. Build a ghost outlined button: transparent background, 1px solid #2c2c2c border, text 'Reserve a Table' in Satoshi 500, 14px, uppercase, letter-spacing -0.14px, color #2c2c2c. Padding 20px vertical, 28px horizontal. Border-radius 3px. No shadow.

3. Build a testimonial card: background #d8cbb8 (same as canvas), border-radius 0px, padding 52px top / 28px sides / 32px bottom. Five #d49653 stars at top, review body in Satoshi 500 14px #2c2c2c, author name in #978e81 Satoshi 500 12px at bottom. No border, no shadow.

## Editorial Type Philosophy

The type system performs a deliberate duet: TT Ramillas Variable at weight 300 sings the editorial aria at extreme sizes (50-115px), while Satoshi at weight 500 provides the structural recitative at 12-15px. The serif never appears below 22px — it is a display voice only. The sans never appears above 42px except the singular 199px hero wordmark. All headings are uppercase. Letter-spacing tightens aggressively with size: -0.0060em at 26px, -0.0300em at 50px, -0.0400em at 65px and above. Line-heights compress to 0.8-0.9 at display sizes, letting oversized lettersets stack into dense typographic blocks reminiscent of vintage restaurant menus and fashion magazine covers.

## Motion Philosophy

Motion is minimal and deliberate. Primary duration is 0.4s with ease easing for hover states and reveals. The marquee animation is the only extended motion (27s linear) and is reserved for signature dish name scrolling. All interactive transitions use the cubic-bezier(0.25, 0.46, 0.45, 0.94) curve for organic deceleration. No parallax, no scroll-triggered animations, no loading sequences — the page should feel like turning pages of a printed menu, not navigating a web app.

## Similar Brands

- **SAGA** — Same editorial restaurant aesthetic with oversized serif headings and dark atmospheric photography over full-bleed sections
- **Lilia (Missy Robbins)** — Similar whisper-weight serif at extreme sizes paired with minimal sharp-geometry UI and warm earthy palette
- **Le Bernardin** — Fine-dining restraint with monochrome warm canvas, single accent color, and editorial type hierarchy
- **Atomix** — Korean fine-dining site using similar parchment-toned canvas, sharp 0px-radius cards, and large uppercase display serif
- **Sqirl (LA)** — Warm beige dominant palette with dark photographic hero sections and minimal sharp-cornered component geometry

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-parchment: #d8cbb8;
  --color-linen: #bfb4a3;
  --color-warm-stone: #b6ab9c;
  --color-walnut: #978e81;
  --color-espresso: #615b53;
  --color-onyx-warm: #2c2c2c;
  --color-midnight-roast: #292622;
  --color-saffron-glow: #d49653;

  /* Typography — Font Families */
  --font-tt-ramillas-variable: 'TT Ramillas Variable', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-satoshi: 'Satoshi', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 13px;
  --leading-caption: 1.3;
  --tracking-caption: -0.143px;
  --text-body: 15px;
  --leading-body: 1.4;
  --tracking-body: -0.15px;
  --text-body-lg: 26px;
  --leading-body-lg: 1.2;
  --tracking-body-lg: -0.156px;
  --text-subheading: 42px;
  --leading-subheading: 1;
  --tracking-subheading: -1.68px;
  --text-heading-sm: 50px;
  --leading-heading-sm: 0.9;
  --tracking-heading-sm: -1.5px;
  --text-heading: 65px;
  --leading-heading: 0.85;
  --tracking-heading: -2.6px;
  --text-heading-lg: 69px;
  --leading-heading-lg: 0.9;
  --tracking-heading-lg: -2.76px;
  --text-display: 115px;
  --leading-display: 0.8;
  --tracking-display: -4.6px;

  /* Typography — Weights */
  --font-weight-light: 300;
  --font-weight-medium: 500;
  --font-weight-bold: 700;

  /* Spacing */
  --spacing-4: 4px;
  --spacing-5: 5px;
  --spacing-6: 6px;
  --spacing-7: 7px;
  --spacing-8: 8px;
  --spacing-10: 10px;
  --spacing-12: 12px;
  --spacing-16: 16px;
  --spacing-17: 17px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-28: 28px;
  --spacing-32: 32px;
  --spacing-42: 42px;
  --spacing-92: 92px;
  --spacing-206: 206px;

  /* Layout */
  --page-max-width: 1440px;
  --section-gap: 120-160px;
  --card-padding: 28px;
  --element-gap: 12-16px;

  /* Border Radius */
  --radius-sm: 3px;

  /* Named Radii */
  --radius-tags: 3px;
  --radius-cards: 0px;
  --radius-inputs: 3px;
  --radius-buttons: 3px;

  /* Surfaces */
  --surface-parchment-canvas: #d8cbb8;
  --surface-linen: #bfb4a3;
  --surface-midnight-roast: #292622;
  --surface-onyx-warm: #2c2c2c;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-parchment: #d8cbb8;
  --color-linen: #bfb4a3;
  --color-warm-stone: #b6ab9c;
  --color-walnut: #978e81;
  --color-espresso: #615b53;
  --color-onyx-warm: #2c2c2c;
  --color-midnight-roast: #292622;
  --color-saffron-glow: #d49653;

  /* Typography */
  --font-tt-ramillas-variable: 'TT Ramillas Variable', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-satoshi: 'Satoshi', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 13px;
  --leading-caption: 1.3;
  --tracking-caption: -0.143px;
  --text-body: 15px;
  --leading-body: 1.4;
  --tracking-body: -0.15px;
  --text-body-lg: 26px;
  --leading-body-lg: 1.2;
  --tracking-body-lg: -0.156px;
  --text-subheading: 42px;
  --leading-subheading: 1;
  --tracking-subheading: -1.68px;
  --text-heading-sm: 50px;
  --leading-heading-sm: 0.9;
  --tracking-heading-sm: -1.5px;
  --text-heading: 65px;
  --leading-heading: 0.85;
  --tracking-heading: -2.6px;
  --text-heading-lg: 69px;
  --leading-heading-lg: 0.9;
  --tracking-heading-lg: -2.76px;
  --text-display: 115px;
  --leading-display: 0.8;
  --tracking-display: -4.6px;

  /* Spacing */
  --spacing-4: 4px;
  --spacing-5: 5px;
  --spacing-6: 6px;
  --spacing-7: 7px;
  --spacing-8: 8px;
  --spacing-10: 10px;
  --spacing-12: 12px;
  --spacing-16: 16px;
  --spacing-17: 17px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-28: 28px;
  --spacing-32: 32px;
  --spacing-42: 42px;
  --spacing-92: 92px;
  --spacing-206: 206px;

  /* Border Radius */
  --radius-sm: 3px;
}
```
