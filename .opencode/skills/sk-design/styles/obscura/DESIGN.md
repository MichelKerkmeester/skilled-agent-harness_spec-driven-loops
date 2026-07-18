# Obscura — Style Reference
> 8-bit arcade floating on cloud paper

**Theme:** light

Obscura runs on a playful 8-bit arcade vocabulary pressed onto a soft, sky-toned paper canvas. The display type (Jersey 10) is the visual signature: chunky pixel letterforms that read like Game Boy subtitles, paired with the calm, modern geometry of Manrope for everything that needs to be read. A single vivid orange (#ff5e24) does the loud work — CTA fills, link hovers, hero emphasis, card borders — while the rest of the system stays in cream, sky-blue, and graphite. Surfaces float on a pale #e3f1fe cloud with hairline borders and whisper-soft shadows; the page feels like a pixel-art console wallpaper you actually want to live inside. The mood is privacy-as-playfulness, not privacy-as-fortress.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Signal Orange | `#ff5e24` | `--color-signal-orange` | Primary CTA fill, hero headline emphasis, active nav link, card accent border, hover state — the single chromatic voice that earns every pixel it touches |
| Ember Crust | `#6c3200` | `--color-ember-crust` | Footer background, dark-mode brand block — used where the orange needs to recede into a deep, warm base |
| Cloud Mist | `#e3f1fe` | `--color-cloud-mist` | Page canvas tint, card surface wash, secondary button border, decorative fill behind pixel art — the soft sky that everything floats on |
| Graphite Ink | `#232629` | `--color-graphite-ink` | Primary text, nav links, icon strokes, body copy — the near-black with a cool cast that keeps the page from feeling sterile |
| Paper White | `#ffffff` | `--color-paper-white` | Card surface, button text on dark fills, nav background, app-window chrome — the brightest readable layer |
| Slate Pencil | `#5c6066` | `--color-slate-pencil` | Secondary body text, subdued button labels, muted icon fills — the tone of helpful but unhurried copy |
| Ash Mist | `#989ea4` | `--color-ash-mist` | Tertiary text, placeholder, disabled icon color, decorative pixel tints — the quietest readable neutral |
| Blush Shadow | `#dbced0` | `--color-blush-shadow` | Warm-tinted shadow base for card elevation — keeps shadows from looking blue-cold against the cream surface |
| Midnight Ink | `#101828` | `--color-midnight-ink` | Headline text and strong links where the orange isn't appropriate — a rare, almost-black alternative |

## Tokens — Typography

### Jersey 10 — Display and headline type only — the chunky pixel font that names the brand. Used for hero, section headings, and any title that needs to feel like a Game Boy boot screen. Never for body or UI labels. · `--font-jersey-10`
- **Substitute:** Press Start 2P, VT323, Pixelify Sans
- **Weights:** 400, 500
- **Sizes:** 36px, 48px, 60px, 72px, 96px
- **Line height:** 0.70, 0.80, 0.85, 1.00, 1.11
- **Letter spacing:** -0.0310em at 96px, -0.0250em at 36-72px
- **Role:** Display and headline type only — the chunky pixel font that names the brand. Used for hero, section headings, and any title that needs to feel like a Game Boy boot screen. Never for body or UI labels.

### Manrope Variable — Body, nav, button labels, links, small UI text, captions. Carries all the prose and functional copy so the pixel font can stay loud. Weight 600-700 for emphasis, 400 for paragraphs, 500 for buttons and nav. · `--font-manrope-variable`
- **Substitute:** Inter, Plus Jakarta Sans, DM Sans
- **Weights:** 400, 500, 600, 700, 800
- **Sizes:** 12px, 14px, 16px, 18px
- **Line height:** 1.33, 1.43, 1.50, 1.56, 1.75
- **Letter spacing:** normal
- **Role:** Body, nav, button labels, links, small UI text, captions. Carries all the prose and functional copy so the pixel font can stay loud. Weight 600-700 for emphasis, 400 for paragraphs, 500 for buttons and nav.

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 12px | 1.5 | — | `--text-caption` |
| body-sm | 14px | 1.43 | — | `--text-body-sm` |
| body | 16px | 1.5 | — | `--text-body` |
| subheading | 18px | 1.56 | — | `--text-subheading` |
| heading-sm | 36px | 1.11 | -0.9px | `--text-heading-sm` |
| heading | 48px | 0.85 | -1.2px | `--text-heading` |
| heading-lg | 60px | 0.85 | -1.5px | `--text-heading-lg` |
| display | 96px | 0.8 | -3px | `--text-display` |

## Tokens — Spacing & Shapes

**Base unit:** 8px

**Density:** comfortable

### Spacing Scale

| Name | Value | Token |
|------|-------|-------|
| 8 | 8px | `--spacing-8` |
| 16 | 16px | `--spacing-16` |
| 24 | 24px | `--spacing-24` |
| 32 | 32px | `--spacing-32` |
| 48 | 48px | `--spacing-48` |
| 64 | 64px | `--spacing-64` |
| 80 | 80px | `--spacing-80` |
| 96 | 96px | `--spacing-96` |
| 128 | 128px | `--spacing-128` |
| 192 | 192px | `--spacing-192` |

### Border Radius

| Element | Value |
|---------|-------|
| nav | 6px |
| cards | 12px |
| links | 6px |
| images | 24px |
| buttons | 6px |
| cardsLarge | 16px |
| featurePanels | 32px |

### Shadows

| Name | Value | Token |
|------|-------|-------|
| xl | `rgba(0, 0, 0, 0.01) 0px 49px 30px 0px, rgba(0, 0, 0, 0.03...` | `--shadow-xl` |
| md | `rgba(15, 34, 52, 0.01) 0px 27px 11px 0px, rgba(15, 34, 52...` | `--shadow-md` |
| subtle | `oklab(1 0 5.96046e-8 / 0.17) 0px 0.5px 0.5px 0.5px inset,...` | `--shadow-subtle` |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 48px
- **Card padding:** 16px
- **Element gap:** 16px

## Components

### Primary CTA Button
**Role:** The single filled-orange action — the loudest element on any page

Filled #ff5e24 background, white text in Manrope 500 at 16px, 6px radius, padding 8px 16px or 16px 32px. Carries an inset orange-tinted shadow + 1px orange outer ring to read as 'pressed in'. Right-arrow icon in white sits to the right of the label. Never outlined, never ghost for the primary.

### Secondary Outlined Button
**Role:** Low-emphasis alternative to the orange CTA

Transparent fill, 1px border in #e3f1fe (Cloud Mist), Graphite Ink text at Manrope 500 16px, 6px radius, same 8px/16px vertical padding as primary. Soft Cloud Mist outer shadow. Used for 'Manage Account' and similar utility actions.

### Ghost Text Link
**Role:** Inline and nav-link clickable text

No background, no border, Graphite Ink (#232629) at Manrope 500 14-16px. Underline appears on hover in Signal Orange. Active state in nav uses orange text + 1px orange ring shadow.

### Hero Section
**Role:** First-fold brand statement

Centered stack on Cloud Mist (#e3f1fe) canvas. Jersey 10 at 96px / 60px for the two-line headline — first line in Graphite Ink, second line in Signal Orange for contrast. Body sentence in Manrope 400 16px, Slate Pencil color, max-width ~560px. Primary CTA centered below. Pixel-art cloud sprites float around the edges as decoration, never cropped by the container.

### Feature Card
**Role:** Mid-page content panels with illustration

White (#ffffff) surface, 12px radius, 16px internal padding, Soft border in #e3f1fe. Multi-layer blue-tinted shadow stack (the 4-layer rgba(15,34,52,…) pattern). Jersey 10 heading at 36-48px in Graphite Ink, Manrope body below in Slate Pencil. Pixel illustration or icon sits above the heading.

### App Window Mockup
**Role:** Product UI screenshot embedded in marketing

Rounded 12-16px outer radius. macOS-style traffic-light row (red, yellow, green dots) in top-left. Internal sidebar with nav items — active item gets a blue (#e3f1fe) pill background. Main panel is white with a status card showing 'Connected to [City]' in Signal Orange, a green check icon, and a ghost 'Disconnect' button in pale red/pink.

### Status Pill (Connected / Disconnected)
**Role:** Inline state indicator inside app mocks and trust badges

Manrope 500 14px, white text, 6px radius, full padding 6px 12px. Connected = #ff5e24 fill. Disconnected = soft pink/coral fill with dark text. Always paired with a small check or cross icon to the left of the label.

### Pixel Cloud Sprite
**Role:** Decorative 8-bit cloud graphic scattered across hero and section dividers

Hand-drawn pixel cloud, ~3-4 shades of #e3f1fe and #ffffff to suggest depth, with a thin #5c6066 1px outline. Always 2-3 sprites per section, never centered — they drift into corners and edges. No shadow, no gradient — pure flat pixel blocks.

### Footer Block
**Role:** Bottom-of-page dark warm surface

Full-width #6c3200 (Ember Crust) background. White and warm-cream text in Manrope 400-500. Sits as a tonal contrast to the sky-blue page — the only dark surface on the entire site.

### Navigation Bar
**Role:** Top sticky header with logo, links, and account controls

Transparent or white background, no visible border. Logo 'obscura' left in Manrope 700 lowercase Graphite Ink. Centered nav links in Manrope 500 14px. Right cluster: 'Manage Account' as ghost text link + 'Get Started' as the orange CTA with 6px radius. Active nav item gets the orange ring inset shadow.

### Inline Pixel Mascot
**Role:** Branded character (cat) appearing in product mocks and section accents

Tiny pixel-art cat or robot in Manrope-orange and warm grays, ~40-80px tall. Appears in app mockup sidebar, as a section accent, and in the hero lower-left. No outlines other than the pixel grid itself — flat 1-2 color fill per block.

### Section Divider (Pixel Cloud Cluster)
**Role:** Visual breath between content sections

A 2-3 cloud sprite cluster sitting in the negative space between sections, always off-center. No text, no line — the clouds ARE the divider. Uses the same Cloud Mist palette as the page canvas.

## Do's and Don'ts

### Do
- Use Jersey 10 for every display heading (36px and above) — it's the brand's voice and the fastest way to make a page read as Obscura.
- Keep the CTA palette disciplined: one Signal Orange (#ff5e24) fill per screen, nothing else in that color slot.
- Let the Cloud Mist (#e3f1fe) canvas do atmospheric work — apply it as a full-bleed page background, not just card fills.
- Pair the two display line-heights intentionally: 0.80-0.85 for multi-line heroes so the pixel font stacks tightly, 1.11 for single-line section heads that need breathing room.
- Use 6px radius on all interactive elements (buttons, nav pills, tags) and reserve 12px+ for cards and app mocks — the contrast in corner softness is part of the system.
- Anchor every page with 1-2 pixel cloud sprites drifting in the corners; a page without them loses its arcade personality.
- Apply the orange-ring inset shadow to the active nav state and focused primary button only — it signals interaction without color-shifting.

### Don't
- Don't use Jersey 10 for body text, button labels, nav links, or any UI copy below 36px — the pixel grid becomes unreadable.
- Don't introduce a second brand color. Blue-tinted surfaces (#e3f1fe) are atmospheric, not chromatic — they are not 'blue accents'.
- Don't apply the Signal Orange to large background fills; the orange is for small punctuation (buttons, emphasis words, active states, borders) only.
- Don't use pure black (#000000) for text — the Graphite Ink (#232629) cool cast is what keeps the cream surface from looking dead.
- Don't stack elevation: a card uses exactly one shadow pattern. Adding a second outer ring or glow breaks the soft, paper-like feel.
- Don't use sharp 0px corners on feature cards — 12-16px radius is the floor for any panel surface.
- Don't place pixel cloud sprites centered, behind text, or larger than ~120px — they should always feel like a sky decoration, not a feature illustration.

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Sky Canvas | `#e3f1fe` | The page-wide pale-blue tint that gives the entire site its cloud-paper atmosphere |
| 1 | Card Paper | `#ffffff` | Lifted card and content-panel surfaces — the default elevated reading surface |
| 2 | App Window | `#f5f5f7` | macOS-style chrome behind product UI — slightly cooler than card paper to recede |
| 3 | Ember Ground | `#6c3200` | Footer block — the dark warm surface that anchors the page |

## Elevation

- **Standard Card:** `rgba(15, 34, 52, 0.01) 0px 27px 11px 0px, rgba(15, 34, 52, 0.02) 0px 15px 9px 0px, rgba(15, 34, 52, 0.04) 0px 7px 7px 0px, rgba(15, 34, 52, 0.04) 0px 2px 4px 0px`
- **Elevated Card:** `rgba(0, 0, 0, 0.01) 0px 49px 30px 0px, rgba(0, 0, 0, 0.03) 0px 22px 22px 0px, rgba(0, 0, 0, 0.03) 0px 5px 12px 0px`
- **Active Nav / Focused Button:** `rgba(255, 94, 36, 0.17) 0px 0.5px 0.5px 0.5px inset, rgba(153, 37, 18, 0.2) 0px -1px 0.5px 0px inset, rgb(255, 94, 36) 0px 0px 0px 1px`

## Imagery

Obscura runs on hand-built 8-bit pixel art rather than photography or 3D renders. The visual vocabulary is Game Boy / NES sprite work: flat-color pixel blocks, 1-2 shades per object, no anti-aliasing, no gradients inside the art. Three recurring subjects carry the system — pixel clouds (the most-used motif, drifting in cream and sky-blue tones), a small pixel cat/robot mascot (orange and warm gray, appears in app mocks and section corners), and the macOS-style app window containing the product UI. Product screenshots are styled with real window chrome (traffic-light dots, sidebar nav) so the product feels native to a desktop. There is no photography, no stock imagery, no abstract gradient blobs. Illustrations are always flat-outlined or flat-filled, always contained inside cards or floating in the page margin, never overlapping text blocks. The pixel art carries mood (playful, retro, privacy-as-adventure) while the product UI screenshot carries credibility (real, installed, usable).

## Layout

Page layout is max-width contained (1200px) on a full-bleed Cloud Mist (#e3f1fe) canvas. The hero is centered-stack: a two-line pixel headline, a single short paragraph, a single orange CTA, and two ghost platform options below — with pixel cloud sprites floating in the negative space to the left and right. Sections stack vertically with 48px gaps and breathe generously; there are no hard horizontal dividers, the cloud sprites do the visual separation. Content alternates between centered single-column (hero, CTA bands) and 2-column text-plus-card (feature explanations, where the left text block pairs with a right-side card mockup or pixel illustration). Card grids appear as 2- and 3-column at desktop, collapsing to single column on mobile. The app-window mockup sits as a large, centered hero element below the fold, stretching to the edges of the content column. Navigation is a single top bar — logo left, centered links, account cluster right — transparent or white, no sticky shadow. Footer is a single full-bleed dark band in Ember Crust (#6c3200), breaking the otherwise all-cream rhythm.

## Agent Prompt Guide

**Quick Color Reference**
- text: #232629 (Graphite Ink)
- background: #e3f1fe (Cloud Mist) over #ffffff (Paper White) cards
- border: #e3f1fe (Cloud Mist, 1px)
- accent: #ff5e24 (Signal Orange)
- primary action: #ff5e24 (filled action)
- dark surface: #6c3200 (Ember Crust, footer only)

**Example Component Prompts**

1. Create a Primary Action Button: #ff5e24 background, #101828 text, 9999px radius, compact pill padding. Use this filled treatment for the main CTA.

2. *Feature card*: White (#ffffff) surface, 12px radius, 16px internal padding, 1px #e3f1fe border, 4-layer blue-tinted shadow stack. Heading in Jersey 10 36px Graphite Ink letter-spacing -0.9px. Body in Manrope 400 16px Slate Pencil. Small pixel illustration (40-60px) sits above the heading.

3. *Status pill inside app mock*: Manrope 500 14px white text on Signal Orange (#ff5e24) fill, 6px radius, 6px 12px padding, small green check icon to the left of the label 'Connected to New York, NY'.

4. *Ghost nav link*: No background, no border. Manrope 500 14px Graphite Ink. Underline appears on hover in Signal Orange. Active state adds 1px orange ring inset shadow.

5. *Footer band*: Full-width Ember Crust (#6b3200) background. Logo and links in Manrope 400-500 14px in white and warm cream (#f5e6dc). 48px internal padding top and bottom.

## Pixel Art Direction

All decorative graphics are hand-authored 8-bit pixel art, NOT CSS pixels, NOT smooth vector illustrations. Each sprite uses a fixed grid (typically 16x16 or 32x32 base), flat fills of 1-3 colors per object, and a 1px darker-tone outline. Anti-aliasing is forbidden — if a curve looks smooth, it's wrong. The pixel cloud is the most-reused motif: ~3-4 shades of #e3f1fe and #ffffff with a #5c6066 1px outline, always floating, never anchored to a baseline. The pixel mascot cat appears in the app mockup sidebar and as a section accent — warm orange + warm gray, no more than 80px tall. When in doubt, fewer pixels at a larger size beats more pixels crammed into a small space — the pixel grid should always be readable.

## Similar Brands

- **1Password** — Same friendly-privacy tone with a single warm accent color and clean white-on-cream surfaces, though Obscura leans more playful with its pixel font.
- **Proton Mail** — Comparable trustworthy-privacy palette logic — near-black text on white, single brand color doing the action work, minimal decorative noise.
- **Linear** — Shares the 'one chromatic accent against a quiet neutral canvas' discipline and the restrained, modern Manrope-grade body type paired with a strong display voice.
- **Oh My Zsh / Pixel-art developer tools** — Same 8-bit retro typography and cloud-sprite decoration vocabulary, though Obscura uses it for marketing warmth rather than terminal nostalgia.

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-signal-orange: #ff5e24;
  --color-ember-crust: #6c3200;
  --color-cloud-mist: #e3f1fe;
  --color-graphite-ink: #232629;
  --color-paper-white: #ffffff;
  --color-slate-pencil: #5c6066;
  --color-ash-mist: #989ea4;
  --color-blush-shadow: #dbced0;
  --color-midnight-ink: #101828;

  /* Typography — Font Families */
  --font-jersey-10: 'Jersey 10', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-manrope-variable: 'Manrope Variable', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.5;
  --text-body-sm: 14px;
  --leading-body-sm: 1.43;
  --text-body: 16px;
  --leading-body: 1.5;
  --text-subheading: 18px;
  --leading-subheading: 1.56;
  --text-heading-sm: 36px;
  --leading-heading-sm: 1.11;
  --tracking-heading-sm: -0.9px;
  --text-heading: 48px;
  --leading-heading: 0.85;
  --tracking-heading: -1.2px;
  --text-heading-lg: 60px;
  --leading-heading-lg: 0.85;
  --tracking-heading-lg: -1.5px;
  --text-display: 96px;
  --leading-display: 0.8;
  --tracking-display: -3px;

  /* Typography — Weights */
  --font-weight-regular: 400;
  --font-weight-medium: 500;
  --font-weight-semibold: 600;
  --font-weight-bold: 700;
  --font-weight-extrabold: 800;

  /* Spacing */
  --spacing-unit: 8px;
  --spacing-8: 8px;
  --spacing-16: 16px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-48: 48px;
  --spacing-64: 64px;
  --spacing-80: 80px;
  --spacing-96: 96px;
  --spacing-128: 128px;
  --spacing-192: 192px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 48px;
  --card-padding: 16px;
  --element-gap: 16px;

  /* Border Radius */
  --radius-md: 6px;
  --radius-xl: 12px;
  --radius-2xl: 16px;
  --radius-3xl: 24px;
  --radius-3xl-2: 32px;

  /* Named Radii */
  --radius-nav: 6px;
  --radius-cards: 12px;
  --radius-links: 6px;
  --radius-images: 24px;
  --radius-buttons: 6px;
  --radius-cardslarge: 16px;
  --radius-featurepanels: 32px;

  /* Shadows */
  --shadow-xl: rgba(0, 0, 0, 0.01) 0px 49px 30px 0px, rgba(0, 0, 0, 0.03) 0px 22px 22px 0px, rgba(0, 0, 0, 0.03) 0px 5px 12px 0px;
  --shadow-md: rgba(15, 34, 52, 0.01) 0px 27px 11px 0px, rgba(15, 34, 52, 0.02) 0px 15px 9px 0px, rgba(15, 34, 52, 0.04) 0px 7px 7px 0px, rgba(15, 34, 52, 0.04) 0px 2px 4px 0px;
  --shadow-subtle: oklab(1 0 5.96046e-8 / 0.17) 0px 0.5px 0.5px 0.5px inset, oklab(0.598475 0.14309 0.112215 / 0.2) 0px -1px 0.5px 0px inset, rgb(255, 94, 36) 0px 0px 0px 1px;

  /* Surfaces */
  --surface-sky-canvas: #e3f1fe;
  --surface-card-paper: #ffffff;
  --surface-app-window: #f5f5f7;
  --surface-ember-ground: #6c3200;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-signal-orange: #ff5e24;
  --color-ember-crust: #6c3200;
  --color-cloud-mist: #e3f1fe;
  --color-graphite-ink: #232629;
  --color-paper-white: #ffffff;
  --color-slate-pencil: #5c6066;
  --color-ash-mist: #989ea4;
  --color-blush-shadow: #dbced0;
  --color-midnight-ink: #101828;

  /* Typography */
  --font-jersey-10: 'Jersey 10', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-manrope-variable: 'Manrope Variable', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.5;
  --text-body-sm: 14px;
  --leading-body-sm: 1.43;
  --text-body: 16px;
  --leading-body: 1.5;
  --text-subheading: 18px;
  --leading-subheading: 1.56;
  --text-heading-sm: 36px;
  --leading-heading-sm: 1.11;
  --tracking-heading-sm: -0.9px;
  --text-heading: 48px;
  --leading-heading: 0.85;
  --tracking-heading: -1.2px;
  --text-heading-lg: 60px;
  --leading-heading-lg: 0.85;
  --tracking-heading-lg: -1.5px;
  --text-display: 96px;
  --leading-display: 0.8;
  --tracking-display: -3px;

  /* Spacing */
  --spacing-8: 8px;
  --spacing-16: 16px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-48: 48px;
  --spacing-64: 64px;
  --spacing-80: 80px;
  --spacing-96: 96px;
  --spacing-128: 128px;
  --spacing-192: 192px;

  /* Border Radius */
  --radius-md: 6px;
  --radius-xl: 12px;
  --radius-2xl: 16px;
  --radius-3xl: 24px;
  --radius-3xl-2: 32px;

  /* Shadows */
  --shadow-xl: rgba(0, 0, 0, 0.01) 0px 49px 30px 0px, rgba(0, 0, 0, 0.03) 0px 22px 22px 0px, rgba(0, 0, 0, 0.03) 0px 5px 12px 0px;
  --shadow-md: rgba(15, 34, 52, 0.01) 0px 27px 11px 0px, rgba(15, 34, 52, 0.02) 0px 15px 9px 0px, rgba(15, 34, 52, 0.04) 0px 7px 7px 0px, rgba(15, 34, 52, 0.04) 0px 2px 4px 0px;
  --shadow-subtle: oklab(1 0 5.96046e-8 / 0.17) 0px 0.5px 0.5px 0.5px inset, oklab(0.598475 0.14309 0.112215 / 0.2) 0px -1px 0.5px 0px inset, rgb(255, 94, 36) 0px 0px 0px 1px;
}
```
