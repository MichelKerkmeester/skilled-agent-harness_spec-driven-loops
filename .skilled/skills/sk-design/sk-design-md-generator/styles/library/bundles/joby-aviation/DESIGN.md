# Joby Aviation — Style Reference
> Golden hour cockpit over a sleeping city — every screen is a window seat.

**Theme:** light

Joby Aviation's design language is cinematic aviation editorial: full-bleed golden-hour photography carries the narrative, with a warm parchment canvas (#f5f4df) and near-black ink (#0e1620) doing all the structural work. The interface stays minimal and almost invisible so the imagery does the persuading — text overlays float over photographs with thin left-border accents rather than boxed containers. Vivid electric blue (#007ae5) appears only as functional punctuation on floating cards, the bottom tour strip, and select icon strokes, while the custom Joby Display type at near-200px sizes whispers the headline rather than shouts it. Components are light, floating, and round; even the tour card and small chips use generous 16px radii, and the navigation is reduced to a centered logomark with a hamburger and a single text link. The system never decorates — every surface is either a photograph, the warm cream canvas, or a single solid blue band.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Parchment Cream | `#f5f4df` | `--color-parchment-cream` | Page canvas, card surfaces, text color on dark imagery — the warm off-white that keeps photography from feeling cold |
| Carbon Ink | `#0e1620` | `--color-carbon-ink` | Body text, headings, hairline borders, icon strokes — near-black with a cool blue undertone that pairs with the cream |
| Pale Sky | `#c1dfef` | `--color-pale-sky` | Soft secondary surface wash, subtle section backgrounds when cream needs contrast |
| Shadow Khaki | `#abab9c` | `--color-shadow-khaki` | Warm gray used in card box-shadow tinting — gives elevation a warm cast rather than a cold blue |
| Electric Blue | `#007ae5` | `--color-electric-blue` | Blue wash for highlight backgrounds, decorative bands, and soft emphasis behind content. Do not promote it to the primary CTA color |
| Deep Cobalt | `#1c3f99` | `--color-deep-cobalt` | Secondary brand surface for navigation bars and accent fills — darker register of the blue for layering |
| Outlined Action | `#083e6f` | `--color-outlined-action` | Blue accent for outlined action borders, linked labels, and lightweight interactive emphasis. Do not promote it to the primary CTA color |
| Sunset Orange | `#eb6110` | `--color-sunset-orange` | Warm accent fill for decorative highlights and select illustration elements — echoes the golden-hour photography palette |
| Peach Glow | `#ffd9c9` | `--color-peach-glow` | Soft warm surface accent, peachy wash that harmonizes with the sunset photography |
| Signal Blue | `#319fff` | `--color-signal-blue` | Brighter blue accent for small icon and illustration highlights — lighter pop than the primary Electric Blue |

## Tokens — Typography

### jobyDisplay — Display headlines and hero text. Sizes scale dramatically from 40px to 207px with tight tracking (-0.03em at the largest sizes) — the near-200px display weight is the signature: whisper-light at colossal scale, the opposite of typical bold-hero convention. Used for hero copy ('Skip traffic. Time to fly.') and section display headlines. · `--font-jobydisplay`
- **Substitute:** Inter Display or a geometric grotesque with low contrast and generous x-height
- **Weights:** 500, 550
- **Sizes:** 10px, 18px, 24px, 28px, 40px, 48px, 64px, 80px, 141px, 207px
- **Line height:** 1.00, 1.05, 1.20
- **Letter spacing:** -0.0300em, -0.0200em, -0.0100em
- **Role:** Display headlines and hero text. Sizes scale dramatically from 40px to 207px with tight tracking (-0.03em at the largest sizes) — the near-200px display weight is the signature: whisper-light at colossal scale, the opposite of typical bold-hero convention. Used for hero copy ('Skip traffic. Time to fly.') and section display headlines.

### jobyText — All body copy, navigation, badges, footer, and inline links. The 450 weight is distinctive — a custom intermediate weight between Regular and Medium that gives body text a subtly heavier presence than a standard 400. Tight letter-spacing (-0.01 to -0.02em) even at body sizes reinforces the display font's compressed character. · `--font-jobytext`
- **Substitute:** Inter or a humanist sans with similar weight gradations
- **Weights:** 400, 450, 500, 550
- **Sizes:** 12px, 14px, 16px, 18px
- **Line height:** 0.89, 1.00, 1.20, 1.30, 1.40
- **Letter spacing:** -0.0200em, -0.0100em
- **Role:** All body copy, navigation, badges, footer, and inline links. The 450 weight is distinctive — a custom intermediate weight between Regular and Medium that gives body text a subtly heavier presence than a standard 400. Tight letter-spacing (-0.01 to -0.02em) even at body sizes reinforces the display font's compressed character.

### Joby Sans Display — Micro-display usage at 12px for labels and tags that need display-type personality at small scale — -0.03em tracking gives these tiny labels the same compressed character as the 200px headlines · `--font-joby-sans-display`
- **Substitute:** Same family as jobyDisplay at 12px
- **Weights:** 500
- **Sizes:** 12px
- **Line height:** 1.20
- **Letter spacing:** -0.0300em
- **Role:** Micro-display usage at 12px for labels and tags that need display-type personality at small scale — -0.03em tracking gives these tiny labels the same compressed character as the 200px headlines

### Arial — System fallback for button text and icon-adjacent micro-copy where system font rendering is preferred · `--font-arial`
- **Substitute:** Arial
- **Weights:** 400
- **Sizes:** 13px
- **Line height:** 1.20
- **Role:** System fallback for button text and icon-adjacent micro-copy where system font rendering is preferred

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 12px | 1.2 | -0.36px | `--text-caption` |
| body-sm | 14px | 1.3 | -0.14px | `--text-body-sm` |
| body | 16px | 1.4 | -0.16px | `--text-body` |
| body-lg | 18px | 1.3 | -0.18px | `--text-body-lg` |
| subheading | 28px | 1.2 | -0.56px | `--text-subheading` |
| heading-sm | 40px | 1.05 | -1.2px | `--text-heading-sm` |
| heading | 64px | 1.05 | -1.92px | `--text-heading` |
| heading-lg | 80px | 1 | -2.4px | `--text-heading-lg` |
| display | 207px | 1 | -6.21px | `--text-display` |

## Tokens — Spacing & Shapes

**Base unit:** 8px

**Density:** spacious

### Spacing Scale

| Name | Value | Token |
|------|-------|-------|
| 8 | 8px | `--spacing-8` |
| 16 | 16px | `--spacing-16` |
| 24 | 24px | `--spacing-24` |
| 32 | 32px | `--spacing-32` |
| 40 | 40px | `--spacing-40` |
| 56 | 56px | `--spacing-56` |
| 80 | 80px | `--spacing-80` |

### Border Radius

| Element | Value |
|---------|-------|
| cards | 16px |
| buttons | 8px |
| asymmetric | 147.6px |
| promoCards | 160px |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 113px
- **Card padding:** 40px
- **Element gap:** 8-32px

## Components

### Floating Promo Card
**Role:** Promotional overlay card for campaign announcements (e.g. 'Electric Skies Tour')

Electric Blue (#007ae5) solid background, white text, 16px corner radius, ~32px padding. Positioned floating top-right of hero. Contains a small kicker label, a display-size headline, a thin white close-button circle, and a miniature product illustration. The card reads as a single bold chromatic moment against the dark photographic hero.

### Cinematic Full-Bleed Hero
**Role:** First-viewport hero using full-bleed photography

Edge-to-edge photographic image with no visible container. White or cream headline text overlaid at the lower-center in jobyDisplay at 64-80px, weight 500, tracking -0.03em. The text floats directly on the image with no card or background plate — the photography provides the contrast.

### Bordered Caption Block
**Role:** Short editorial text overlay on photography

Body text at 16px in Parchment Cream (#f5f4df) over dark imagery. Marked by a 2-4px vertical left-border accent line in cream. No background fill, no padding box — just the text and a thin guide line. Max width ~320px, positioned lower-left. The left border is the only structural element.

### Centered Logomark Navigation
**Role:** Minimal top navigation bar

Transparent bar over hero photography. Joby wordmark and aviation mark centered in white. Hamburger icon (two horizontal lines) at far left in white. A single 'Investors ↗' text link at far right in white, jobyText 16px weight 500. No background fill, no shadow, no border — the bar dissolves into the photograph.

### Saturated Banner Strip
**Role:** Full-width tour/event announcement band

Full-bleed Electric Blue (#007ae5) horizontal band, ~60-80px tall. Centered white text in jobyText 16px weight 500, tracking -0.01em. Single line of copy. No border, no rounded corners — sits as a sharp color transition at the page base.

### Outlined Icon Button
**Role:** Ghost/secondary action control

No background fill. Outlined Action (#083e6f) border at 1-2px, 8px radius. Icon centered in Outlined Action color. Sized approximately 40-48px square. This is the preferred action pattern: a chromatic border replaces a filled background so the control stays visually quiet against the cream canvas or photography.

### Warm Card Surface
**Role:** Content card on the cream canvas

Parchment Cream (#f5f4df) background with box-shadow in Shadow Khaki (#abab9c) at low opacity, giving the elevation a warm cast rather than a cold blue. 16px corner radius. 40px internal padding. Hairline border in Carbon Ink (#0e1620) at low opacity sometimes replaces the shadow for flatter compositions.

### Asymmetric Rounded Container
**Role:** Editorial content block with extreme corner curvature

Uses 160px or 147.6px corner radii — the intentionally asymmetric, near-circular rounding that signals a featured/promotional treatment. Always used for premium or hero-adjacent content. Carbon Ink text on Parchment Cream or Electric Blue fill.

### Footer Link List
**Role:** Footer navigation columns

jobyText 14px weight 450 in Carbon Ink, 15-26px horizontal padding between items, 32px vertical rhythm. Underlined link state in Outlined Action (#083e6f) at 14px. No visible dividers or backgrounds — the footer reads as a clean text grid.

### Hairline Divider
**Role:** Section separator

1px horizontal line in Carbon Ink (#0e1620) at ~10-20% opacity, or in Parchment Cream at similar opacity when over dark imagery. Used to separate content sections without adding visual weight.

### Dark Image Overlay
**Role:** Text contrast layer on photography

No actual overlay — text uses pure Parchment Cream (#f5f4df) at 16.4:1 contrast against the darkest parts of the photograph. The contrast ratio is designed into the photography, not achieved with a scrim.

## Do's and Don'ts

### Do
- Use jobyDisplay at 48-207px with tracking between -0.01em and -0.03em for all headlines — the compressed, large-scale typography is the brand's primary signature
- Default all content surfaces to Parchment Cream (#f5f4df) with Carbon Ink (#0e1620) text — the warm/cool duotone is the structural backbone
- Reserve Electric Blue (#007ae5) for floating cards, the bottom banner strip, and single-color accent moments — never tile it across large areas
- Use outlined actions with Outlined Action (#083e6f) borders at 8px radius instead of filled buttons — the ghost control pattern keeps the interface quiet against photography
- Apply 16px radius to standard cards and 160px radius to featured/promotional containers — the radius itself signals content importance
- Float body text directly over photography with a 2-4px left-border accent in cream rather than wrapping it in a card or scrim
- Maintain generous spacing: 40px card padding, 32px vertical rhythm, 8-32px element gaps — the spacious density lets the photography breathe

### Don't
- Do not use filled rectangular CTA buttons — the system uses outlined actions, floating cards, or text links instead
- Do not apply standard gray or blue-tinted drop shadows — the only shadow is the warm khaki glow on cream cards
- Do not use bold (700+) weight for headlines — jobyDisplay's signature is weight 500-550 at extreme sizes, not heavy weight at moderate sizes
- Do not add dark scrims or background plates behind text on photography — the contrast is built into the image itself
- Do not use multiple saturated colors in one composition — Electric Blue, Cobalt, and Sunset Orange each appear in isolated moments, never together
- Do not apply system fonts (Arial, Helvetica) to headlines or body — they are fallback only for 13px button text
- Do not add gradients, patterns, or decorative backgrounds — every surface is either solid cream, solid blue, or a photograph

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Imagery Layer | `#0e1620` | Full-bleed photography and dark cinematic backgrounds — the dominant first impression |
| 1 | Parchment Canvas | `#f5f4df` | Default content surface for all editorial text sections, cards, and structural blocks |
| 2 | Pale Sky Wash | `#c1dfef` | Subtle alternative surface for section contrast against the cream |
| 3 | Electric Blue Band | `#007ae5` | Saturated accent surface for the bottom tour strip and floating promo card |
| 4 | Cobalt Depth | `#1c3f99` | Darker blue layer for navigation chrome and stacked accent surfaces |

## Elevation

- **Warm Card Surface:** `0px 0px 40px 0px rgba(171, 171, 156, 0.4)`

## Imagery

Photography is the primary visual asset and dominates the page. All imagery is cinematic, golden-hour aerial photography shot from inside an eVTOL cockpit looking out over a sleeping city skyline. The treatment is full-bleed, no rounded corners, no masks — images extend to all edges of the viewport. The lighting is consistently warm sunset/dawn with deep amber highlights and cool blue-grey city silhouettes, giving every image a built-in duotone that matches the Parchment Cream and Carbon Ink palette. Product illustrations appear only inside the floating Electric Skies promo card (small eVTOL render in white/blue line art). No lifestyle photography, no people in staged settings — the single human figure is a silhouetted passenger in the cockpit, visible only as a dark shape against the window. The photography is documentary in feel, not aspirational: the viewer is a passenger, not a spectator.

## Layout

The page is a full-bleed single-column experience with no visible grid or sidebar. The hero occupies the full viewport with centered text overlaid on the photograph. Below the hero, a saturated Electric Blue banner strip spans the full width. Content sections alternate between full-bleed photography (with text overlays) and the warm cream canvas. A centered logomark navigation sits at the top with a hamburger left and a single text link right — no horizontal nav bar, no mega-menu. Text blocks are left-aligned with a thin vertical accent border, max-width ~320px, positioned lower-left of the frame. The layout rhythm is: full-bleed photo → cream text section → full-bleed photo → cream text section, with no visible card containers or boxed layouts. The generous section gap (113px) and the spacious density make the page feel like flipping through a premium print magazine rather than navigating a website.

## Agent Prompt Guide

primary action: #083e6f (outlined action border)
Create an Outlined Primary Action: Transparent background, #083e6f border and text, 9999px radius, compact pill padding. Use it for the main CTA instead of a filled button.
QUICK COLOR REFERENCE:
- text: #0e1620 (Carbon Ink)
- background: #f5f4df (Parchment Cream)
- border: #0e1620 (Carbon Ink, hairline at low opacity)
- accent: #007ae5 (Electric Blue)
- floating card / banner surface: #007ae5 (Electric Blue)
- outlined action border: #083e6f (Outlined Action)

EXAMPLE COMPONENT PROMPTS:

1. Create a floating promo card: 16px corner radius, 32px padding, Electric Blue (#007ae5) background, white kicker label in jobyText 12px weight 500, white display headline in jobyDisplay 28px weight 500, tracking -0.56px, small white close-button circle (24px, 1px white border, no fill).

2. Create a hero section: full-bleed photographic background (no overlay), white headline in jobyDisplay at 80px weight 500, tracking -2.4px, positioned lower-center. No card, no background plate, no scrim — text floats directly on the image.

3. Create a bordered caption block: Parchment Cream (#f5f4df) text in jobyText 16px weight 450, tracking -0.16px, max-width 320px, positioned lower-left over dark imagery, with a 3px vertical left-border accent line in Parchment Cream. No background fill.

4. Create a content card: Parchment Cream (#f5f4df) background, 16px corner radius, 40px internal padding, box-shadow 0px 0px 40px 0px rgba(171,171,156,0.4). Carbon Ink (#0e1620) body text in jobyText 16px weight 450.

5. Create a ghost icon button: no background fill, 8px corner radius, 1.5px border in Outlined Action (#083e6f), 44px square, centered icon in Outlined Action color. This is the preferred action pattern — never use a filled rectangular button.

## Typography Philosophy

The Joby type system runs on two custom families: jobyDisplay for headlines and jobyText for everything else. The signature is contrast through scale, not weight. jobyDisplay is used at weights 500-550 even at 207px — the same weight as body text, just enormous. This is anti-convention: most brands use weight 700-900 to make large headlines feel authoritative, but Joby uses medium weight at extreme scale, which makes the type feel like it's floating rather than planted. The tight tracking (-0.03em at the largest sizes, -0.01em at body) compresses the letterforms and gives the headlines a condensed, aviation-instrument feel. The jobyText 450 weight is a custom intermediate step that gives body copy a subtly heavier presence than standard 400 without crossing into medium territory — this is the weight that makes 16px body text feel intentional rather than default.

## Similar Brands

- **Lilium** — Same eVTOL aviation category with full-bleed cinematic photography and minimal UI overlay
- **Archer Aviation** — Same warm/cool duotone palette (cream + deep ink) with single electric blue accent and oversized display headlines
- **Tesla** — Same ghost-button + minimal-chrome approach with full-bleed product photography as the primary visual
- **Rivian** — Same spacious editorial layout with photography-first composition and quiet, restrained UI chrome

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-parchment-cream: #f5f4df;
  --color-carbon-ink: #0e1620;
  --color-pale-sky: #c1dfef;
  --color-shadow-khaki: #abab9c;
  --color-electric-blue: #007ae5;
  --color-deep-cobalt: #1c3f99;
  --color-outlined-action: #083e6f;
  --color-sunset-orange: #eb6110;
  --color-peach-glow: #ffd9c9;
  --color-signal-blue: #319fff;

  /* Typography — Font Families */
  --font-jobydisplay: 'jobyDisplay', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-jobytext: 'jobyText', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-joby-sans-display: 'Joby Sans Display', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-arial: 'Arial', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.2;
  --tracking-caption: -0.36px;
  --text-body-sm: 14px;
  --leading-body-sm: 1.3;
  --tracking-body-sm: -0.14px;
  --text-body: 16px;
  --leading-body: 1.4;
  --tracking-body: -0.16px;
  --text-body-lg: 18px;
  --leading-body-lg: 1.3;
  --tracking-body-lg: -0.18px;
  --text-subheading: 28px;
  --leading-subheading: 1.2;
  --tracking-subheading: -0.56px;
  --text-heading-sm: 40px;
  --leading-heading-sm: 1.05;
  --tracking-heading-sm: -1.2px;
  --text-heading: 64px;
  --leading-heading: 1.05;
  --tracking-heading: -1.92px;
  --text-heading-lg: 80px;
  --leading-heading-lg: 1;
  --tracking-heading-lg: -2.4px;
  --text-display: 207px;
  --leading-display: 1;
  --tracking-display: -6.21px;

  /* Typography — Weights */
  --font-weight-regular: 400;
  --font-weight-w450: 450;
  --font-weight-medium: 500;
  --font-weight-w550: 550;

  /* Spacing */
  --spacing-unit: 8px;
  --spacing-8: 8px;
  --spacing-16: 16px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-40: 40px;
  --spacing-56: 56px;
  --spacing-80: 80px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 113px;
  --card-padding: 40px;
  --element-gap: 8-32px;

  /* Border Radius */
  --radius-lg: 8px;
  --radius-2xl: 16px;
  --radius-full: 147.6px;
  --radius-full-2: 160px;

  /* Named Radii */
  --radius-cards: 16px;
  --radius-buttons: 8px;
  --radius-asymmetric: 147.6px;
  --radius-promocards: 160px;

  /* Surfaces */
  --surface-imagery-layer: #0e1620;
  --surface-parchment-canvas: #f5f4df;
  --surface-pale-sky-wash: #c1dfef;
  --surface-electric-blue-band: #007ae5;
  --surface-cobalt-depth: #1c3f99;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-parchment-cream: #f5f4df;
  --color-carbon-ink: #0e1620;
  --color-pale-sky: #c1dfef;
  --color-shadow-khaki: #abab9c;
  --color-electric-blue: #007ae5;
  --color-deep-cobalt: #1c3f99;
  --color-outlined-action: #083e6f;
  --color-sunset-orange: #eb6110;
  --color-peach-glow: #ffd9c9;
  --color-signal-blue: #319fff;

  /* Typography */
  --font-jobydisplay: 'jobyDisplay', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-jobytext: 'jobyText', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-joby-sans-display: 'Joby Sans Display', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-arial: 'Arial', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.2;
  --tracking-caption: -0.36px;
  --text-body-sm: 14px;
  --leading-body-sm: 1.3;
  --tracking-body-sm: -0.14px;
  --text-body: 16px;
  --leading-body: 1.4;
  --tracking-body: -0.16px;
  --text-body-lg: 18px;
  --leading-body-lg: 1.3;
  --tracking-body-lg: -0.18px;
  --text-subheading: 28px;
  --leading-subheading: 1.2;
  --tracking-subheading: -0.56px;
  --text-heading-sm: 40px;
  --leading-heading-sm: 1.05;
  --tracking-heading-sm: -1.2px;
  --text-heading: 64px;
  --leading-heading: 1.05;
  --tracking-heading: -1.92px;
  --text-heading-lg: 80px;
  --leading-heading-lg: 1;
  --tracking-heading-lg: -2.4px;
  --text-display: 207px;
  --leading-display: 1;
  --tracking-display: -6.21px;

  /* Spacing */
  --spacing-8: 8px;
  --spacing-16: 16px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-40: 40px;
  --spacing-56: 56px;
  --spacing-80: 80px;

  /* Border Radius */
  --radius-lg: 8px;
  --radius-2xl: 16px;
  --radius-full: 147.6px;
  --radius-full-2: 160px;
}
```
