# Leonardo.ai — Style Reference
> Inverted editorial gallery. A black-walled museum where 165px violet headlines act as wall installations and AI-generated portraits hang in a tight grid below.

**Theme:** dark

Leonardo.ai is a cinematic dark-mode creative arena: near-black canvas (#000000) serves as an infinite gallery floor, and the interface speaks through sheer typographic mass rather than chrome. The brand voice is built on one saturated violet (#6e60ee) used sparingly as identity punctuation, surrounded by a vivid six-color tag palette (green, violet, yellow, pink, coral, blue) that acts as categorical color-coding for plans, styles, and creator types. Display type reaches absurd scale (up to 165px) with compressed line-heights of 0.80–0.90 and tight -0.02em tracking, making headlines feel like sculptural objects rather than text. Controls are soft and pill-shaped (60px radius), surfaces are nearly borderless, and the layout breathes with generous negative space punctuated by a tight card grid of generated imagery. The system is editorial-meets-product: it treats the page itself as a generative canvas where the UI recedes and the creator's output dominates.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Midnight Canvas | `#000000` | `--color-midnight-canvas` | Primary page background, hero canvas, footer base |
| Obsidian Surface | `#0a0a0a` | `--color-obsidian-surface` | Elevated surface, nav backdrop, deep overlay wash |
| Charcoal Card | `#353535` | `--color-charcoal-card` | Card surface, image card background, raised panel |
| Fog | `#f5f5f5` | `--color-fog` | Light surface inversion, subtle highlight wash |
| Bone White | `#ffffff` | `--color-bone-white` | Primary text, filled primary action background, high-contrast iconography |
| Mist | `#e5e5e5` | `--color-mist` | Hairline borders, dividers, subtle structural lines across all surfaces |
| Ash Text | `#999999` | `--color-ash-text` | Muted body text, list items, secondary link color |
| Charcoal Mute | `#666666` | `--color-charcoal-mute` | De-emphasized text, disabled states, tertiary metadata |
| Ink Black | `#030303` | `--color-ink-black` | SVG decorative fills, near-black accent inside dark composition |
| Leonardo Violet | `#6e60ee` | `--color-leonardo-violet` | Brand identity color — logo mark, active tab indicator, brand surface highlights, signature wordmark |
| Toxic Lime | `#03e65b` | `--color-toxic-lime` | Green wash for highlight backgrounds, decorative bands, and soft emphasis behind content |
| Voltage Yellow | `#ffc533` | `--color-voltage-yellow` | Warm accent for category tags, feature highlight chips, energy-coded badges |
| Shock Pink | `#ff3386` | `--color-shock-pink` | Hot accent for tag chips, creator-type badges, vibrant category markers |
| Ember Coral | `#ff5d4b` | `--color-ember-coral` | Warm accent for tag chips, plan indicators, red-orange category coding |
| Plasma Pink | `#d25fff` | `--color-plasma-pink` | Magenta-violet accent for card backgrounds, secondary brand surface treatment |
| Arc Blue | `#33d0ff` | `--color-arc-blue` | Cool accent for tag chips, informational category markers, data-state indicators |

## Tokens — Typography

### leoSans — Display and editorial headlines. The signature font — used at massive scale (up to 165px) for brand wordmarks, section heroes, and sculptural typography. Weights 800–900 create the compressed, almost-condensed poster feel; the extremely tight line-heights (0.80–0.90) let words stack into blocks. Letter-spacing tightens to -0.02em on the largest sizes to optically close the gaps between heavy strokes. · `--font-leosans`
- **Substitute:** Druk, Tungsten, Inter (900 only)
- **Weights:** 500, 800, 900
- **Sizes:** 34, 44, 65, 90, 165
- **Line height:** 0.80–0.93
- **Letter spacing:** -0.02em (display) down to -0.01em (mid-headings)
- **Role:** Display and editorial headlines. The signature font — used at massive scale (up to 165px) for brand wordmarks, section heroes, and sculptural typography. Weights 800–900 create the compressed, almost-condensed poster feel; the extremely tight line-heights (0.80–0.90) let words stack into blocks. Letter-spacing tightens to -0.02em on the largest sizes to optically close the gaps between heavy strokes.

### canvaSans — UI and body text — navigation, buttons, tab labels, captions, list items, card metadata. Clean geometric sans across 10–19px. Weight 500 carries the most UI presence; 700 is reserved for emphasis in tabs and active states. The narrow 10–19px range keeps the type system disciplined and UI-focused. · `--font-canvasans`
- **Substitute:** Inter, Plus Jakarta Sans, General Sans
- **Weights:** 400, 500, 700
- **Sizes:** 10, 12, 14, 16, 18, 19
- **Line height:** 1.10–1.33
- **Letter spacing:** normal
- **Role:** UI and body text — navigation, buttons, tab labels, captions, list items, card metadata. Clean geometric sans across 10–19px. Weight 500 carries the most UI presence; 700 is reserved for emphasis in tabs and active states. The narrow 10–19px range keeps the type system disciplined and UI-focused.

### ufficioDisplay — Specialty editorial accent — used sparingly for a single mid-scale heading where a different personality is needed · `--font-ufficiodisplay`
- **Substitute:** Times Now, Playfair Display, GT Sectra
- **Weights:** 500
- **Sizes:** 34
- **Line height:** 0.92
- **Letter spacing:** -0.02em
- **Role:** Specialty editorial accent — used sparingly for a single mid-scale heading where a different personality is needed

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 10px | 1.2 | — | `--text-caption` |
| body | 14px | 1.33 | — | `--text-body` |
| subheading | 19px | 1.15 | — | `--text-subheading` |
| heading-sm | 34px | 0.92 | -0.68px | `--text-heading-sm` |
| heading | 48px | 0.9 | -0.96px | `--text-heading` |
| heading-lg | 78px | 0.85 | -1.56px | `--text-heading-lg` |
| display | 98px | 0.8 | -1.96px | `--text-display` |
| display-xl | 165px | 0.8 | -3.3px | `--text-display-xl` |

## Tokens — Spacing & Shapes

**Density:** compact

### Spacing Scale

| Name | Value | Token |
|------|-------|-------|
| 5 | 5px | `--spacing-5` |
| 7 | 7px | `--spacing-7` |
| 10 | 10px | `--spacing-10` |
| 14 | 14px | `--spacing-14` |
| 17 | 17px | `--spacing-17` |
| 20 | 20px | `--spacing-20` |
| 27 | 27px | `--spacing-27` |
| 34 | 34px | `--spacing-34` |
| 41 | 41px | `--spacing-41` |
| 44 | 44px | `--spacing-44` |
| 47 | 47px | `--spacing-47` |
| 54 | 54px | `--spacing-54` |
| 61 | 61px | `--spacing-61` |
| 68 | 68px | `--spacing-68` |
| 135 | 135px | `--spacing-135` |
| 203 | 203px | `--spacing-203` |

### Border Radius

| Element | Value |
|---------|-------|
| tags | 270px |
| cards | 8px |
| inputs | 6px |
| buttons | 60px |
| cardsLarge | 20px |
| imageCards | 8px |

### Layout

- **Page max-width:** 1440px
- **Section gap:** 80px
- **Card padding:** 20px
- **Element gap:** 10px

## Components

### Primary CTA Button (Filled Pill)
**Role:** Main conversion action — the only filled button in the system

White-filled pill button: 60px border-radius (full pill), white background (#ffffff), black text (#0a0a0a), canvaSans weight 500 at 14–16px, padding 27px horizontal × 10px vertical. No border, no drop shadow — the white-on-black contrast is the elevation. Used for the single primary action per screen ('Start now').

### Secondary Ghost Button (Outlined Pill)
**Role:** Companion action beside the primary CTA

Transparent-fill pill button: 60px border-radius, 1px border in #e5e5e5 (or #b3b3b3 at lower contrast), canvaSans weight 500 white text at 14–16px, padding 27px × 10px. Sits beside the primary CTA as a quieter alternative path ('Developer API').

### Active Tab Pill
**Role:** Selected category tab in horizontal filter bars

Filled violet pill: 60px border-radius, #6e60ee background, white canvaSans weight 500 text at 16px, padding 20px × 10px. Carries a subtle violet glow (0 0 24px rgba(110,96,238,0.45)) to mark the active state. Inactive tabs are plain white text on black, no background.

### Nav Utility Button (Tutorial / Log in)
**Role:** Top-right navigation actions

Ghost pill for 'Tutorial' (transparent fill, 1px #e5e5e5 border, white text) paired with a filled white pill for 'Log in' (matching the primary CTA style but smaller — padding 14px × 7px, 14px text). These sit as a utility pair in the top-right corner of the nav bar.

### Navigation Bar
**Role:** Site-wide top navigation

Transparent or #0a0a0a background, full-bleed, 60–80px tall. Left: LEONARDO.AI wordmark in canvaSans weight 700 white at ~16px. Center: dropdown nav links (Create, Industry, Business, Learn, Pricing, Contact) in canvaSans weight 500 white at 14–16px. Right: Tutorial ghost + Log in filled pill. No visible bottom border — the nav floats on the dark canvas.

### Gallery Image Card
**Role:** Showcase tile for AI-generated output in galleries and grids

Charcoal (#353535) or near-black background with a single generated image filling the card. 8.4px border-radius. No padding around the image — the image bleeds to the card edge. Image-as-hero treatment: the card is a frame, not a container. Arranged in a tight 3–4 column grid with 10–14px gaps.

### Category Tag Chip
**Role:** Color-coded labels for creator types, plan tiers, style categories

Pill-shaped (270px or 60px radius), small height (auto from text). Background fills with one of the six accent colors (#03e65b, #6e60ee, #ffc533, #ff3386, #ff5d4b, #33d0ff). Text in canvaSans weight 700 white, 12–14px. Padding 7px × 14px. The rainbow palette IS the taxonomy — each tag is immediately identifiable by color alone.

### Hero Display Wordmark
**Role:** Brand expression in the hero — the signature element

leoSans weight 800–900 at 90–165px, color #6e60ee (violet). Line-height compressed to 0.80–0.85, letter-spacing -0.02em. The word 'LEONARDO' is rendered oversized, sometimes perspective-warped or repeated in 3D, filling the full hero viewport. This is not a heading — it is a graphic object that IS the hero.

### Section Headline
**Role:** Standard heading for content sections below the hero

leoSans weight 800 at 44–78px, white (#ffffff), line-height 0.85–0.90, letter-spacing -0.01em to -0.02em. Centered or left-aligned. Below it, canvaSans body text at 14–18px in #999999 or #e5e5e5.

### Icon Button / Creator Avatar Tile
**Role:** Tab or filter activation in the 'For Makers' section

A square tile containing a stylized illustration of a creator type (e.g., profile silhouette in violet). The illustration replaces a traditional icon — the artwork itself is the icon. Violet (#6e60ee) fill for the active selection; neutral grayscale for inactive. ~120px square, 6–8px radius.

### Footer Link List
**Role:** Secondary navigation in the footer

Vertical list of canvaSans links at 14px weight 500 in #999999, 7–10px row gap. No list bullets. On hover, links brighten to #ffffff. Organized in multi-column groups at the page bottom.

## Do's and Don'ts

### Do
- Use the 60px pill radius for all buttons and active tabs — this is the system's signature curve
- Push display type to 90px+ with leoSans weight 800–900 and line-height compressed to 0.80–0.90; let headlines become graphic objects
- Use #6e60ee (Leonardo Violet) as the single brand accent for logo, active state, and brand surfaces — never as a decorative fill
- Apply the six-color accent palette (#03e65b, #ffc533, #ff3386, #ff5d4b, #d25fff, #33d0ff) exclusively to tag chips, category badges, and small color-coded markers
- Set page background to #000000 and card surfaces to #353535 — the 3-step neutral ramp is the entire surface system
- Use hairlines (1px #e5e5e5) rather than shadows for structural separation; on the black canvas, shadows disappear
- Keep body type in canvaSans at 10–19px; reserve leoSans for everything 34px and above

### Don't
- Do not place the white-filled pill on a non-black surface — the white-on-black contrast is what makes it work
- Do not use the accent palette for large fills, backgrounds, or hero sections — those colors are for tag-sized elements only
- Do not use line-height above 1.0 for any leoSans text — the compressed leading is what gives the type its poster-like density
- Do not use the 8.4px card radius for buttons; cards are sharp-cornered, buttons are pill-shaped — do not mix
- Do not introduce new accent colors beyond the six-color palette — the rainbow is the taxonomy
- Do not add drop shadows larger than 1px on dark surfaces; they vanish into the black and create visual noise
- Do not use #6e60ee for body text or large headings; violet is identity, not information

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Midnight Canvas | `#000000` | Base page background, hero immersion field, footer plane |
| 1 | Obsidian Surface | `#0a0a0a` | Navigation bar, sticky overlays, slightly lifted dark zones |
| 2 | Charcoal Card | `#353535` | Image card panels, content blocks, gallery items |

## Elevation

- **Image Card:** `0 0 0 1px rgba(229,229,229,0.06), 0 20px 40px rgba(0,0,0,0.5)`
- **Active Tab Pill:** `0 0 24px rgba(110,96,238,0.45)`
- **Primary CTA:** `0 0 0 1px rgba(255,255,255,0.08)`

## Imagery

Imagery is the product. AI-generated images are presented as gallery prints: edge-to-edge fills in dark cards with 8.4px corners, no padding, no captions, no chrome around them. The images are always tightly cropped and high-quality, arranged in dense 3–4 column grids. The page treats generated output like a portfolio wall — the UI is the gallery, the art is the content. Decorative elements include a sculptural violet wordmark in the hero (leoSans at 165px, sometimes perspective-warped into a 3D environment) and small iconographic creator silhouettes in violet. No stock photography, no lifestyle imagery, no abstract gradients used as backgrounds.

## Layout

Max-width 1440px contained, centered on a full-bleed #000000 canvas. The hero is a full-viewport sculptural typography piece — oversized violet leoSans wordmarks (90–165px) float on black in a perspective/3D arrangement, with the actual headline ('THE CREATOR-FIRST GENERATIVE AI PLATFORM') centered at a comparatively modest 34–48px in white. Below the hero, sections alternate between image gallery grids (3–4 columns, tight 10–14px gaps) and centered text blocks with the vivid six-color tag palette. Tab filter rows sit above gallery sections as horizontal pill bars. Navigation is a minimal transparent top bar with a left wordmark, centered dropdown links, and right-aligned utility buttons. Footer is a multi-column link grid in muted gray (#999999). Vertical rhythm uses 80px section gaps with compact 10px element gaps within sections — the page breathes vertically but packs information horizontally.

## Agent Prompt Guide

## Quick Color Reference
- text: #ffffff
- background: #000000
- surface (card): #353535
- border: #e5e5e5
- accent: #6e60ee (Leonardo Violet — brand)
- primary action: #ffffff (filled action)

## Example Component Prompts
1. **Hero Wordmark Block**: Full-viewport black (#000000) background. Oversized leoSans weight 900 at 165px, #6e60ee, line-height 0.80, letter-spacing -3.3px. Repeating the brand name as a sculptural element.

2. Create a Primary Action Button: #ffffff background, #000000 text, 9999px radius, compact pill padding. Use this filled treatment for the main CTA.

3. **Ghost Outline Pill**: 60px border-radius, transparent background, 1px border #e5e5e5, canvaSans weight 500 at 16px, text #ffffff, padding 27px × 10px.

4. **Active Tab Filter**: Horizontal row of filter labels. Active = 60px radius pill, #6e60ee fill, white canvaSans 16px weight 500. Inactive = plain white text, no background. 27px horizontal gap between pills.

5. **Gallery Image Card**: 8.4px border-radius, image fills the card edge-to-edge with no padding, #353535 fallback background. Arrange in a 3-column grid with 14px gaps. The image IS the content — the card is just a frame.

## Similar Brands

- **Midjourney** — Same dark-canvas gallery model with AI-generated imagery as the hero; identical 'the art is the UI' philosophy
- **Runway** — Same dark-mode creative-tool aesthetic with minimal chrome and vivid accent-color category tags
- **NightCafe Creator** — Same creator-first AI art platform with grid-based gallery showcase and compact card surfaces
- **Pika** — Same oversize display type on black, minimal navigation, and treatment of generated media as the page's primary content
- **Stability AI** — Same editorial-poster hero treatment with massive brand wordmarks and a single saturated accent against pure black

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-midnight-canvas: #000000;
  --color-obsidian-surface: #0a0a0a;
  --color-charcoal-card: #353535;
  --color-fog: #f5f5f5;
  --color-bone-white: #ffffff;
  --color-mist: #e5e5e5;
  --color-ash-text: #999999;
  --color-charcoal-mute: #666666;
  --color-ink-black: #030303;
  --color-leonardo-violet: #6e60ee;
  --color-toxic-lime: #03e65b;
  --color-voltage-yellow: #ffc533;
  --color-shock-pink: #ff3386;
  --color-ember-coral: #ff5d4b;
  --color-plasma-pink: #d25fff;
  --color-arc-blue: #33d0ff;

  /* Typography — Font Families */
  --font-leosans: 'leoSans', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-canvasans: 'canvaSans', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-ufficiodisplay: 'ufficioDisplay', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 10px;
  --leading-caption: 1.2;
  --text-body: 14px;
  --leading-body: 1.33;
  --text-subheading: 19px;
  --leading-subheading: 1.15;
  --text-heading-sm: 34px;
  --leading-heading-sm: 0.92;
  --tracking-heading-sm: -0.68px;
  --text-heading: 48px;
  --leading-heading: 0.9;
  --tracking-heading: -0.96px;
  --text-heading-lg: 78px;
  --leading-heading-lg: 0.85;
  --tracking-heading-lg: -1.56px;
  --text-display: 98px;
  --leading-display: 0.8;
  --tracking-display: -1.96px;
  --text-display-xl: 165px;
  --leading-display-xl: 0.8;
  --tracking-display-xl: -3.3px;

  /* Typography — Weights */
  --font-weight-regular: 400;
  --font-weight-medium: 500;
  --font-weight-bold: 700;
  --font-weight-extrabold: 800;
  --font-weight-black: 900;

  /* Spacing */
  --spacing-5: 5px;
  --spacing-7: 7px;
  --spacing-10: 10px;
  --spacing-14: 14px;
  --spacing-17: 17px;
  --spacing-20: 20px;
  --spacing-27: 27px;
  --spacing-34: 34px;
  --spacing-41: 41px;
  --spacing-44: 44px;
  --spacing-47: 47px;
  --spacing-54: 54px;
  --spacing-61: 61px;
  --spacing-68: 68px;
  --spacing-135: 135px;
  --spacing-203: 203px;

  /* Layout */
  --page-max-width: 1440px;
  --section-gap: 80px;
  --card-padding: 20px;
  --element-gap: 10px;

  /* Border Radius */
  --radius-md: 6px;
  --radius-lg: 8.4375px;
  --radius-2xl: 16.4375px;
  --radius-2xl-2: 20.4375px;
  --radius-full: 60px;
  --radius-full-2: 270px;

  /* Named Radii */
  --radius-tags: 270px;
  --radius-cards: 8px;
  --radius-inputs: 6px;
  --radius-buttons: 60px;
  --radius-cardslarge: 20px;
  --radius-imagecards: 8px;

  /* Surfaces */
  --surface-midnight-canvas: #000000;
  --surface-obsidian-surface: #0a0a0a;
  --surface-charcoal-card: #353535;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-midnight-canvas: #000000;
  --color-obsidian-surface: #0a0a0a;
  --color-charcoal-card: #353535;
  --color-fog: #f5f5f5;
  --color-bone-white: #ffffff;
  --color-mist: #e5e5e5;
  --color-ash-text: #999999;
  --color-charcoal-mute: #666666;
  --color-ink-black: #030303;
  --color-leonardo-violet: #6e60ee;
  --color-toxic-lime: #03e65b;
  --color-voltage-yellow: #ffc533;
  --color-shock-pink: #ff3386;
  --color-ember-coral: #ff5d4b;
  --color-plasma-pink: #d25fff;
  --color-arc-blue: #33d0ff;

  /* Typography */
  --font-leosans: 'leoSans', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-canvasans: 'canvaSans', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-ufficiodisplay: 'ufficioDisplay', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 10px;
  --leading-caption: 1.2;
  --text-body: 14px;
  --leading-body: 1.33;
  --text-subheading: 19px;
  --leading-subheading: 1.15;
  --text-heading-sm: 34px;
  --leading-heading-sm: 0.92;
  --tracking-heading-sm: -0.68px;
  --text-heading: 48px;
  --leading-heading: 0.9;
  --tracking-heading: -0.96px;
  --text-heading-lg: 78px;
  --leading-heading-lg: 0.85;
  --tracking-heading-lg: -1.56px;
  --text-display: 98px;
  --leading-display: 0.8;
  --tracking-display: -1.96px;
  --text-display-xl: 165px;
  --leading-display-xl: 0.8;
  --tracking-display-xl: -3.3px;

  /* Spacing */
  --spacing-5: 5px;
  --spacing-7: 7px;
  --spacing-10: 10px;
  --spacing-14: 14px;
  --spacing-17: 17px;
  --spacing-20: 20px;
  --spacing-27: 27px;
  --spacing-34: 34px;
  --spacing-41: 41px;
  --spacing-44: 44px;
  --spacing-47: 47px;
  --spacing-54: 54px;
  --spacing-61: 61px;
  --spacing-68: 68px;
  --spacing-135: 135px;
  --spacing-203: 203px;

  /* Border Radius */
  --radius-md: 6px;
  --radius-lg: 8.4375px;
  --radius-2xl: 16.4375px;
  --radius-2xl-2: 20.4375px;
  --radius-full: 60px;
  --radius-full-2: 270px;
}
```
