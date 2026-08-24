# HNST Studio — Style Reference
> earthy atelier with rust on linen — a slow-fashion gallery where a single burnt-orange accent warms an otherwise monastic cream and charcoal interior

**Theme:** light

HNST Studio speaks in a warm, earthy editorial language: bone-white canvases tinted with raw silk cream, a single rust accent that anchors every interactive moment, and gallery-style uppercase typography that lets the photography breathe. The site treats full-bleed fashion imagery as the primary surface — text and chrome are whisper-thin, positioned like museum placards around the visual work. Two type families divide labor cleanly: Raleway handles UI, navigation, and body copy in humanist proportions, while Poppins takes display headings with extreme letter-spacing, turning section labels like 'TRENDING' into printed gallery signage. Components are stripped to essentials — thin borders, soft sand-toned badges, charcoal ink for action, no shadows, no gradients — so the rust accent lands with editorial gravity against the otherwise neutral palette.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Rust Hearth | `#892500` | `--color-rust-hearth` | Brand logo, active navigation state, section underlines, the only chromatic punctuation in the interface — carries identity weight wherever it appears |
| Blush Whisper | `#ea9195` | `--color-blush-whisper` | Secondary chromatic accent for hover states, soft tags, and paired decorative elements — never standalone, always supporting Rust Hearth |
| Linen | `#ffffff` | `--color-linen` | Neutral form states, badge text, and quiet UI feedback where color should stay understated. Do not promote it to the primary CTA color |
| Raw Silk | `#f9f6f2` | `--color-raw-silk` | Warm off-white page background — replaces sterile pure white to give the site a tactile, natural-fiber feel |
| Sand Plaster | `#eee5d9` | `--color-sand-plaster` | Card backgrounds, badge fills, soft surface lifts — the warm secondary tier that differentiates containers from the page canvas |
| Charcoal Ink | `#0e0e0e` | `--color-charcoal-ink` | Primary text, navigation text, filled action buttons, dark hero overlays — near-black reads softer than pure black against the warm neutrals |
| Stone | `#868686` | `--color-stone` | Mid-gray for hairline borders, dividers, secondary metadata, inactive UI scaffolding — the dominant structural neutral |
| Ash | `#b7b7b7` | `--color-ash` | Lighter borders, muted helper text, disabled states, subtle list separators |
| Frost | `#d7d7d7` | `--color-frost` | Faintest divider lines on links, barely-there separators |

## Tokens — Typography

### Raleway — Primary UI and body typeface — humanist sans with elegant terminals. Used for navigation, body copy, links, buttons, and footer. The 600 weight handles button labels and nav items; 400 carries running text with generous 1.67–1.79 line-height for editorial readability · `--font-raleway`
- **Substitute:** Montserrat, Lato, Nunito Sans
- **Weights:** 400, 600, 700
- **Sizes:** 12px, 13px, 14px, 15px, 16px
- **Line height:** 1.67 (body), 1.70, 1.20 (tight UI)
- **Letter spacing:** 0.1920em, 0.2310em
- **Role:** Primary UI and body typeface — humanist sans with elegant terminals. Used for navigation, body copy, links, buttons, and footer. The 600 weight handles button labels and nav items; 400 carries running text with generous 1.67–1.79 line-height for editorial readability

### Poppins — Display and section-heading typeface — geometric sans used for hero-scale section labels like 'TRENDING' at 62px. Extreme letter-spacing (0.154em at display, 0.091em at 20px) transforms headlines into printed gallery signage, the signature typographic moment of the brand · `--font-poppins`
- **Substitute:** Montserrat, Outfit, Space Grotesk
- **Weights:** 500, 600, 700
- **Sizes:** 11px, 13px, 16px, 20px, 62px
- **Line height:** 1.15 (display), 1.20, 1.25, 2.27 (small caps labels)
- **Letter spacing:** 0.154em at 62px, 0.091em at 20px, 0.065em at 16px, 0.050em at 11–13px
- **Role:** Display and section-heading typeface — geometric sans used for hero-scale section labels like 'TRENDING' at 62px. Extreme letter-spacing (0.154em at display, 0.091em at 20px) transforms headlines into printed gallery signage, the signature typographic moment of the brand

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 11px | 1.25 | 1.69px | `--text-caption` |
| heading-sm | 20px | 1.2 | 1.82px | `--text-heading-sm` |
| display | 62px | 1.15 | 9.55px | `--text-display` |

## Tokens — Spacing & Shapes

**Density:** comfortable

### Spacing Scale

| Name | Value | Token |
|------|-------|-------|
| 4 | 4px | `--spacing-4` |
| 5 | 5px | `--spacing-5` |
| 9 | 9px | `--spacing-9` |
| 10 | 10px | `--spacing-10` |
| 12 | 12px | `--spacing-12` |
| 15 | 15px | `--spacing-15` |
| 20 | 20px | `--spacing-20` |
| 23 | 23px | `--spacing-23` |
| 40 | 40px | `--spacing-40` |
| 42 | 42px | `--spacing-42` |
| 45 | 45px | `--spacing-45` |
| 75 | 75px | `--spacing-75` |
| 114 | 114px | `--spacing-114` |
| 170 | 170px | `--spacing-170` |
| 185 | 185px | `--spacing-185` |

### Border Radius

| Element | Value |
|---------|-------|
| cards | 0px |
| pills | 10px |
| badges | 0px |
| buttons | 0px |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 75-170px
- **Card padding:** 42px
- **Element gap:** 15px

## Components

### Top Navigation Bar
**Role:** Primary site header with brand mark and section links

Full-bleed bar, 10–15px vertical padding, no shadow. Rust Hearth (#892500) lowercase wordmark 'hnst' at ~32px Raleway 700 left-aligned. Right side: uppercase nav links (HOME, SUSTAINABILITY, PRESS, SHOP) in Raleway 600 at 12–13px with 0.192–0.231em letter-spacing and Stone (#868686) color, 15px horizontal gap. Active state switches text to Rust Hearth. Thin Stone hairline border-bottom separates from content.

### Hero Carousel
**Role:** Full-viewport lifestyle photography opening the homepage

Full-bleed image at 100vw width, ~80vh height, no radius. Left/right arrow controls rendered as thin chevrons in semi-transparent white, 48px tap targets, vertically centered. Four-dot pagination indicator centered at the bottom in white with the active dot at full opacity. No headline overlay — the photograph carries the message.

### Section Display Heading
**Role:** Gallery-label style title for content sections

Poppins 700 at 62px, letter-spacing 9.55px (0.154em), line-height 1.15, color Charcoal Ink (#0e0e0e). Centered or left-aligned depending on context. This is the signature type moment — the extreme tracking makes 'TRENDING' read as a printed wall label, not a web heading.

### Filled Action Button
**Role:** Primary call-to-action in Charcoal Ink

Charcoal Ink (#0e0e0e) background, Linen (#ffffff) text, Raleway 600 at 13–14px, uppercase with 0.192em letter-spacing. Padding 15px horizontal, 42px to 45px on wider variants. Zero radius — the sharp corners reinforce the editorial gallery aesthetic.

### Ghost Navigation Button
**Role:** Secondary or inactive link styled as borderless uppercase text

No background or border. Raleway 600 at 12–13px, uppercase, letter-spacing 0.192em, color Stone (#868686). Hover transitions to Charcoal Ink (#0e0e0e). Used in the nav bar and footer link clusters.

### Editorial Image Block
**Role:** Large product or story photograph in a content section

Full-width or right-column image with zero radius, no border, no shadow. Floating at the edge of the container or centered. Sits on Raw Silk (#f9f6f2) or Linen (#ffffff) canvas. The image itself is the component — no frame or caption chrome around it.

### Sand Badge
**Role:** Soft warm-toned tag for metadata or status

Sand Plaster (#eee5d9) background, no border, zero radius. Raleway 600 at 12–13px, Charcoal Ink text, padding 8–10px horizontal, 4–6px vertical. Used for small contextual labels, timestamps, and category markers.

### Info Icon Button
**Role:** Small floating circular button for secondary actions

Charcoal Ink (#0e0e0e) fill, white lowercase 'i' glyph at 16px, 40×40px square with zero radius. Fixed-position utility button (info panel toggle, cart preview). High contrast against the warm canvas.

### Carousel Arrow
**Role:** Slide navigation control for the hero and product carousels

Minimal chevron icon, 24px, white at 70% opacity over imagery, Charcoal Ink on light backgrounds. No background shape — the arrow floats directly on the image. 48px invisible hit area for touch.

### Section Divider Band
**Role:** Full-bleed photographic strip separating content sections

100vw width, ~20–30vh height, zero radius, edge-to-edge image. Functions as a visual palate cleanser between text blocks. Examples: the industrial textile-mill photograph and the leather/texture close-up that appear as horizontal bands between editorial sections.

### List Item with Marker
**Role:** Bulleted or numbered list inside editorial copy

Raleway 400 at 14–15px, line-height 1.70, color Charcoal Ink. 9px horizontal gap between marker and text. Stone (#868686) thin left-border on the list container at 1px. No custom bullet glyphs — relies on default markers or small rust-colored dots when brand-styled.

### Pill Filter Tag
**Role:** Rounded interactive tag for filtering product lists

The only rounded component in the system at 10px radius. Sand Plaster (#eee5d9) or Linen (#ffffff) background with 1px Stone (#868686) border. Raleway 600 at 12–13px, 10–15px horizontal padding, 4–6px vertical. Active state: Rust Hearth border and text.

### Footer Link Cluster
**Role:** Organized link groups in the site footer

Multi-column layout, Raleway 400 at 14px for links, Stone color, 15px vertical gap. Column headers in Raleway 600 uppercase at 12px with 0.192em letter-spacing. Thin Stone top-border separates footer from content. No background color change — footer sits on Raw Silk canvas.

## Do's and Don'ts

### Do
- Use Rust Hearth (#892500) exclusively for the brand wordmark, active nav states, and section underlines — let it carry full identity weight as the only chromatic accent
- Apply Poppins 700 at 62px with 0.154em letter-spacing for all display section headings to maintain the gallery-label signature
- Keep all component corners sharp (0px radius) except pill filter tags, which use 10px — this single exception is intentional
- Set body text at Raleway 400, 15px, line-height 1.70 for editorial readability on the warm Raw Silk canvas
- Use Sand Plaster (#eee5d9) for badge and tag fills to create soft warm-tinted containers that feel like craft paper
- Separate sections with full-bleed photographic bands rather than decorative dividers — the imagery is the structural element
- Maintain 1px Stone (#868686) hairline borders for all structural separation; never use shadows to imply elevation

### Don't
- Do not introduce additional accent colors beyond Rust Hearth and Blush Whisper — the 1% colorfulness is the brand
- Do not use rounded corners on cards, buttons, or images — sharp edges are essential to the editorial-print identity
- Do not add drop shadows or elevation effects to any component — the design system is deliberately flat
- Do not use pure white (#ffffff) as the page background — always use Raw Silk (#f9f6f2) to preserve the warm, natural-fiber atmosphere
- Do not set body text below 14px or above 17px — the type scale is narrow and intentional for editorial reading comfort
- Do not apply tight letter-spacing to display headings — the extreme tracking (0.154em) at 62px is a signature, not a mistake
- Do not overlay text, buttons, or UI chrome on top of hero photography — let the image breathe without interference

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Raw Silk | `#f9f6f2` | Page canvas — warm off-white base for the entire site |
| 1 | Linen | `#ffffff` | Card surfaces, product panels, and elevated content blocks |
| 2 | Sand Plaster | `#eee5d9` | Badge fills, soft tag backgrounds, warm-toned containers |
| 3 | Charcoal Ink | `#0e0e0` | Dark inverted sections, navigation bar, filled action buttons |

## Elevation

- **Navigation Bar:** `none — separated from content by a 1px Stone (#868686) bottom border only`
- **Product Cards:** `none — flat surfaces with thin Stone hairline borders or no border at all`
- **Buttons:** `none — solid fill provides all visual weight`
- **Info Icon Button:** `none — Charcoal Ink solid fill is the visual anchor`

## Imagery

Editorial fashion photography dominates the visual language. The hero features intimate, warmly lit studio portraits of models in relaxed poses against neutral backdrops — high-key with golden undertones, no harsh shadows. Interior editorial sections use industrial and craft-process imagery: textile-mill machinery, raw denim, leather close-ups with warm directional lighting. All photography is full-bleed, sharp-cornered, and unmasked — no rounded edges, no overlays, no decorative frames. The treatment is always cinematic and tactile, favoring material texture (denim weave, leather grain, fabric folds) over product-pack shots. No illustrations, no icons beyond simple UI glyphs, no 3D renders.

## Layout

The page follows a full-bleed editorial rhythm: a full-viewport hero photograph opens the experience, followed by asymmetric content sections where a large image occupies the right half and empty Raw Silk canvas holds the left. Sections are separated by full-bleed photographic bands that act as visual breath. Headlines are centered or left-aligned with extreme letter-spacing, reading as gallery wall text. The grid is single-column or two-column asymmetric, never multi-column card grids. Navigation is a minimal top bar — no sidebar, no mega-menu, no sticky header. Content density is spacious: 75–170px between sections, generous whitespace around all text blocks. The overall feel is of a curated zine or museum catalog, not a retail catalog.

## Agent Prompt Guide

**Quick Color Reference**
- Text: #0e0e0e (Charcoal Ink)
- Background: #f9f6f2 (Raw Silk)
- Border: #868686 (Stone)
- Accent: #892500 (Rust Hearth)
- Card/badge fill: #eee5d9 (Sand Plaster)
- Inverted text: #ffffff (Linen)
- primary action: #0e0e0e (filled action)

**3-5 Example Component Prompts**

1. **Top Navigation Bar**: Full-bleed bar, Raw Silk (#f9f6f2) background, 1px Stone (#868686) bottom border. Left: 'hnst' wordmark in Raleway 700, 32px, Rust Hearth (#892500). Right: nav items (HOME, SUSTAINABILITY, PRESS, SHOP) in Raleway 600, 12px, uppercase, letter-spacing 0.192em, Stone (#868686) color, 15px horizontal gap. Active item in Rust Hearth.

2. **Section Display Heading**: 'TRENDING' set in Poppins 700, 62px, letter-spacing 9.55px (0.154em), line-height 1.15, color Charcoal Ink (#0e0e0e). Centered. No underline, no decoration — the letter-spacing alone creates the gallery-label presence.

3. **Sand Badge**: Sand Plaster (#eee5d9) background, zero radius, no border. Raleway 600, 12px, Charcoal Ink (#0e0e0e) text, padding 10px horizontal and 5px vertical. Used for small contextual labels like 'New Arrival' or 'Limited Edition'.

4. **Editorial Image Block**: Full-width photograph, zero radius, no border, no shadow, no overlay. Sits on Raw Silk (#f9f6f2) canvas. Image fills the container edge-to-edge. Optional caption in Raleway 400, 13px, Stone (#868686) below.

5. **Ghost Navigation Link**: No background, no border. Raleway 600, 13px, uppercase, letter-spacing 0.192em, color Stone (#868686). On hover, transitions to Charcoal Ink (#0e0e0e). 15px horizontal spacing between adjacent links.

## Typography Personality

The two-font system is the most distinctive structural choice. Raleway does the quiet work — navigation, body, buttons, forms — in humanist proportions that feel crafted rather than engineered. Poppins does the loud work once per section, at 62px with 0.154em tracking, turning a single word like 'TRENDING' into a physical sign on a gallery wall. Never let Poppins appear at body sizes; never let Raleway appear at display sizes. The contrast between Raleway's 1.67 body line-height and Poppins' 1.15 display line-height is the tension that gives the typography its voice.

## Spacing Rhythm

Vertical rhythm operates on three tiers: 15px for intra-component gaps (between nav items, list items, badge internals), 42–45px for component-level padding (button interior, card content breathing room), and 75–170px for section-to-section breathing. Never compress below 15px between siblings — the comfortable density is non-negotiable. Section transitions should always include a full-bleed image band as a visual palate cleanser, not just whitespace.

## Similar Brands

- **Patagonia** — Same warm earthy neutral palette with a single rust/burnt-orange brand accent, photography-first editorial layout, and anti-corporate sustainable-fashion tone
- **Eileen Fisher** — Shared commitment to full-bleed lifestyle photography, generous whitespace, cream/off-white canvases, and a minimal sans-serif typography system
- **Toast (toa.st)** — Identical slow-fashion editorial language — warm bone-white backgrounds, sharp-cornered components, no shadows, and a single chromatic accent used sparingly
- **Studio Nicholson** — Same gallery-catalog approach with wide-tracked uppercase section headings, asymmetric image+text layouts, and a restrained near-monochrome palette
- **Asket** — Shared minimal navigation, single accent color philosophy, body-text-forward type system, and photography that fills the viewport without decorative chrome

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-rust-hearth: #892500;
  --color-blush-whisper: #ea9195;
  --color-linen: #ffffff;
  --color-raw-silk: #f9f6f2;
  --color-sand-plaster: #eee5d9;
  --color-charcoal-ink: #0e0e0e;
  --color-stone: #868686;
  --color-ash: #b7b7b7;
  --color-frost: #d7d7d7;

  /* Typography — Font Families */
  --font-raleway: 'Raleway', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-poppins: 'Poppins', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 11px;
  --leading-caption: 1.25;
  --tracking-caption: 1.69px;
  --text-heading-sm: 20px;
  --leading-heading-sm: 1.2;
  --tracking-heading-sm: 1.82px;
  --text-display: 62px;
  --leading-display: 1.15;
  --tracking-display: 9.55px;

  /* Typography — Weights */
  --font-weight-regular: 400;
  --font-weight-medium: 500;
  --font-weight-semibold: 600;
  --font-weight-bold: 700;

  /* Spacing */
  --spacing-4: 4px;
  --spacing-5: 5px;
  --spacing-9: 9px;
  --spacing-10: 10px;
  --spacing-12: 12px;
  --spacing-15: 15px;
  --spacing-20: 20px;
  --spacing-23: 23px;
  --spacing-40: 40px;
  --spacing-42: 42px;
  --spacing-45: 45px;
  --spacing-75: 75px;
  --spacing-114: 114px;
  --spacing-170: 170px;
  --spacing-185: 185px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 75-170px;
  --card-padding: 42px;
  --element-gap: 15px;

  /* Border Radius */
  --radius-lg: 10px;

  /* Named Radii */
  --radius-cards: 0px;
  --radius-pills: 10px;
  --radius-badges: 0px;
  --radius-buttons: 0px;

  /* Surfaces */
  --surface-raw-silk: #f9f6f2;
  --surface-linen: #ffffff;
  --surface-sand-plaster: #eee5d9;
  --surface-charcoal-ink: #0e0e0;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-rust-hearth: #892500;
  --color-blush-whisper: #ea9195;
  --color-linen: #ffffff;
  --color-raw-silk: #f9f6f2;
  --color-sand-plaster: #eee5d9;
  --color-charcoal-ink: #0e0e0e;
  --color-stone: #868686;
  --color-ash: #b7b7b7;
  --color-frost: #d7d7d7;

  /* Typography */
  --font-raleway: 'Raleway', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-poppins: 'Poppins', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 11px;
  --leading-caption: 1.25;
  --tracking-caption: 1.69px;
  --text-heading-sm: 20px;
  --leading-heading-sm: 1.2;
  --tracking-heading-sm: 1.82px;
  --text-display: 62px;
  --leading-display: 1.15;
  --tracking-display: 9.55px;

  /* Spacing */
  --spacing-4: 4px;
  --spacing-5: 5px;
  --spacing-9: 9px;
  --spacing-10: 10px;
  --spacing-12: 12px;
  --spacing-15: 15px;
  --spacing-20: 20px;
  --spacing-23: 23px;
  --spacing-40: 40px;
  --spacing-42: 42px;
  --spacing-45: 45px;
  --spacing-75: 75px;
  --spacing-114: 114px;
  --spacing-170: 170px;
  --spacing-185: 185px;

  /* Border Radius */
  --radius-lg: 10px;
}
```
