# Postevand — Style Reference
> editorial gallery on bone paper

**Theme:** light

Postevand operates as an editorial gallery on bone paper — a completely achromatic environment where the product IS the color. Every interface element reduces to black, white, and a single warm off-white (#f0f1ef), creating a Scandinavian exhibition aesthetic where photography and oversized typography carry all the visual weight. The system is aggressively minimal: hairline black rules divide the canvas into grid cells, buttons are black rectangles that feel like printed labels, and there are zero decorative gradients or chromatic accents. Typography is the only expressive tool — a single sans-serif (Nimbus Sans) speaks in whisper-weight headlines and tight tracking, with the brand wordmark scaled to fill the viewport. Components are skeletal: ghost inputs, black filled buttons that double as text, and cards that are just rectangles on the bone-colored surface.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Ink Black | `#000000` | `--color-ink-black` | Primary text, hairline borders, filled button backgrounds, navigation rules — the structural line weight of the entire system |
| Paper White | `#ffffff` | `--color-paper-white` | Page canvas, input fills, modal surfaces, inverted text on black buttons |
| Bone | `#f0f1ef` | `--color-bone` | Card surfaces, secondary canvas tone — gives the white-on-white system a warm paper-like quality rather than sterile digital white |
| Graphite | `#333333` | `--color-graphite` | Secondary borders, subdued text — used when pure black is too heavy for hairline elements |
| Ash | `#d7d7d7` | `--color-ash` | Input field borders, dividers, placeholder affordance — the lightest structural gray in the stack |

## Tokens — Typography

### Nimbus Sans D OT — Primary typeface for all UI and display — weights 400 for body and nav, 700 for headlines and button labels. The single sans-serif carries the entire brand voice; no serif, no display variant, no decorative cuts · `--font-nimbus-sans-d-ot`
- **Substitute:** Inter, Helvetica Neue, Arial
- **Weights:** 400, 700
- **Sizes:** 10, 12, 16, 32, 56, 80
- **Line height:** 1.00–1.40
- **Letter spacing:** -0.01em at display sizes (32–80px), 0.01em at small sizes (10–12px)
- **Role:** Primary typeface for all UI and display — weights 400 for body and nav, 700 for headlines and button labels. The single sans-serif carries the entire brand voice; no serif, no display variant, no decorative cuts

### Helvetica — System fallback for form inputs and secondary body copy — only appears where native form rendering takes over · `--font-helvetica`
- **Substitute:** Helvetica, Arial
- **Weights:** 300, 400
- **Sizes:** 13, 16, 30
- **Line height:** 1.54–1.60
- **Letter spacing:** 0.006–0.008em
- **Role:** System fallback for form inputs and secondary body copy — only appears where native form rendering takes over

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 10px | 1.2 | 0.1px | `--text-caption` |
| body | 16px | 1.4 | -0.16px | `--text-body` |
| subheading | 32px | 1 | -0.32px | `--text-subheading` |
| heading | 56px | 1 | -0.56px | `--text-heading` |
| display | 80px | 1 | -0.8px | `--text-display` |

## Tokens — Spacing & Shapes

**Base unit:** 4px

**Density:** comfortable

### Spacing Scale

| Name | Value | Token |
|------|-------|-------|
| 4 | 4px | `--spacing-4` |
| 12 | 12px | `--spacing-12` |
| 20 | 20px | `--spacing-20` |
| 24 | 24px | `--spacing-24` |
| 36 | 36px | `--spacing-36` |
| 40 | 40px | `--spacing-40` |
| 60 | 60px | `--spacing-60` |
| 80 | 80px | `--spacing-80` |
| 180 | 180px | `--spacing-180` |

### Border Radius

| Element | Value |
|---------|-------|
| cards | 0px |
| badges | 0px |
| inputs | 0px |
| buttons | 0px |

### Layout

- **Section gap:** 60-80px
- **Card padding:** 20px
- **Element gap:** 20px

## Components

### Top Navigation Bar
**Role:** Persistent site header with brand mark, primary nav, and utility links

Full-width white bar with 1px black bottom border. Logo left, nav links center (SHOP, IMPACT, 3% PLEDGE), utility links right (WHOLESALE, BAG (0)). Nav links are 12px Nimbus Sans 400 uppercase with 0.01em tracking and 20px horizontal padding. Height approximately 60px.

### Hero Product Banner
**Role:** Full-viewport brand statement with oversized wordmark overlay

Edge-to-edge product photography (water carton against sky/cloud) with the 'Postevand™' wordmark at ~80px Nimbus Sans 700 in white, anchored bottom-left and bleeding off the right edge. The image fills the viewport; the type functions as a watermark over the product.

### Black Filled Button
**Role:** Primary action — Subscribe, Add to Cart, form submission

Solid #000000 rectangle, 0px radius, 20px vertical × 67px horizontal padding. Label in white Nimbus Sans 400, 16px. No hover state changes the color — the button is always black. Functions as a printed label rather than an interactive element.

### Ghost Email Input
**Role:** Newsletter signup field inside modal

1px #d7d7d7 border, 0px radius, 12px padding all sides, full width. Placeholder 'Email address' in 16px Nimbus Sans 400. No focus ring color change — the border simply darkens to black on focus. The skeletal restraint makes the black Subscribe button below it the visual anchor.

### Newsletter Modal
**Role:** Centered overlay for email capture

White card, 0px radius, ~40px padding, centered on the page over a semi-transparent backdrop. Heading 'Join our monthly newsletter' in 32px Nimbus Sans 700, black. Subtext in 16px Nimbus Sans 400. Close button (×) in top-right corner as a bare character, not an icon button.

### Section Divider Grid
**Role:** Editorial section break using hairline rules

1px black lines forming a grid overlay across the page — vertical and horizontal hairlines segment content into cells, creating a printed-page or gallery-wall composition. No background color change between sections; the lines do all the structural work.

### Product Card
**Role:** Individual product display in grid layouts

Bone (#f0f1ef) background, 0px radius, 20px padding, optional 1px black border. Product image fills card; product name below in Nimbus Sans 700, price in Nimbus Sans 400. No shadow, no elevation — the card is defined purely by the warm off-white surface against the white page.

### Editorial Headline Block
**Role:** Large display copy in content sections

Nimbus Sans 700 at 56px, black, line-height 1.00, letter-spacing -0.01em. Anchored to grid cells defined by the hairline system. Functions as a poster headline — tight tracking and heavy weight create a gallery-catalogue presence.

### B-Corp Certification Badge
**Role:** Trust mark in footer/overlay

Circular badge with 'Certified B Corporation' text, fixed position bottom-right. Black and white, matching the system's monochromatic discipline. Small, unobtrusive — it is a credential, not a design element.

### Cookie Consent Bar
**Role:** Bottom-fixed privacy notice

Full-width white bar with 1px black top border. Text left ('This website uses cookies...') in 12px Nimbus Sans 400 with underlined 'Privacy Policy' link. Three actions right: PREFERENCES, REJECT, ACCEPT — all as plain text links, 12px uppercase, 0.01em tracking. No filled buttons in the consent flow.

### Utility Nav Link
**Role:** Top-right account/in commerce links

WHOLESALE, BAG (0) links in 12px Nimbus Sans 400 uppercase, black, with 20px horizontal padding. The (0) cart count is inline with the label, separated by a space. Vertical divider line between left-group and right-group nav items.

## Do's and Don'ts

### Do
- Use 0px border-radius on every interactive element and card — the system is architecturally sharp, not soft
- Set body type at 16px Nimbus Sans 400, nav and meta at 12px uppercase with 0.01em letter-spacing
- Use #000000 for all borders, text, and filled buttons — never introduce a second color for structure
- Divide page sections with 1px black hairline grid lines rather than background color changes or whitespace alone
- Place the brand wordmark at 56–80px Nimbus Sans 700 with -0.01em tracking as a compositional element, not just a logo
- Use #f0f1ef (Bone) as the only non-white surface tone for cards and secondary panels
- Set button padding to 20px vertical × 67px horizontal for primary actions; the generous horizontal padding makes buttons feel like printed labels

### Don't
- Do not introduce any chromatic color — the system is 0% colorful by design and any hue breaks the gallery aesthetic
- Do not use border-radius above 0px on cards, buttons, inputs, or images — sharpness is the system's identity
- Do not add box-shadows or elevation effects — the surface stack (white → bone → black) communicates depth through tonal contrast only
- Do not use a second typeface family for display or editorial copy — Nimbus Sans carries the entire voice
- Do not use letter-spacing above 0.01em or below -0.01em — tracking stays tight and controlled
- Do not create colored hover, focus, or active states — the black-on-white binary is the only state system
- Do not use gradients, decorative backgrounds, or textured surfaces — the system is flat and printed

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 1 | Page Canvas | `#ffffff` | Primary page background — pure white, the exhibition wall |
| 2 | Card Surface | `#f0f1ef` | Product cards and secondary panels — warm bone tone creates a printed-paper quality |
| 3 | Inverted Surface | `#000000` | Filled buttons, text on light — the only dark surface in the system |

## Elevation

The system is intentionally flat. No box-shadows, no drop shadows, no glow effects. Depth is communicated exclusively through the three-tone surface stack (white → bone → black) and 1px hairline borders. This editorial print-inspired approach treats the screen as a page, not a window.

## Imagery

Photography is the only color in the system. Product shots are tight, high-key crops on neutral or sky backgrounds — the water carton is photographed against cloud-blue sky in the hero, creating an organic color accent that the interface itself never attempts to replicate. Lifestyle and environmental photography is used editorially: large, full-bleed, and unframed by containers. The product packaging is white with black sans-serif type, echoing the interface's own visual language. No illustrations, no icons beyond a close (×) character, no decorative graphics — every visual element is a photograph or a typographic composition.

## Layout

The page operates on a full-bleed, grid-anchored layout with no max-width container. The hero is a full-viewport image with an oversized wordmark overlay bleeding off the right edge. Below the hero, a 1px black hairline grid divides the page into cells, and content sits within those cells rather than in free-flowing sections. The newsletter modal is centered on the page as an overlay. Navigation is a fixed top bar with a 1px black bottom border. The layout rhythm is gallery-like: generous vertical space between sections, hairline dividers instead of background bands, and text/images positioned on the grid rather than centered in containers. Section gaps of 60-80px create breathing room; the 1px lines do the structural work that background color changes do in conventional designs.

## Agent Prompt Guide

**Quick Color Reference**
- text: #000000
- background: #ffffff
- card surface: #f0f1ef
- border: #000000 (structural) / #d7d7d7 (input/divider)
- accent: none — system is fully achromatic
- primary action: no distinct CTA color

**3-5 Example Component Prompts**

1. **Newsletter Modal**: Centered white card, 0px radius, 40px padding. Heading 'Join our monthly newsletter' at 32px Nimbus Sans 700, #000000. Subtext at 16px Nimbus Sans 400, #000000. Email input below: 1px #d7d7d7 border, 0px radius, 12px padding, placeholder 'Email address' in 16px Nimbus Sans 400. Black filled button beneath: #000000 background, white text at 16px Nimbus Sans 400, 0px radius, 20px vertical × 67px horizontal padding, label 'Subscribe'.

2. **Top Navigation Bar**: Full-width white bar, 60px height, 1px #000000 bottom border. Logo 'Postevand™' left at 12px Nimbus Sans 400. Center nav links: SHOP, IMPACT, 3% PLEDGE in 12px Nimbus Sans 400 uppercase, 0.01em tracking, 20px horizontal padding. Right utility links: WHOLESALE, BAG (0) in same style. No background color, no shadow.

3. **Hero Banner**: Full-viewport-width image (water carton against blue sky) filling the screen height. 'Postevand™' wordmark overlaid at 80px Nimbus Sans 700, white, -0.01em letter-spacing, anchored bottom-left and extending past the right edge of the viewport. No border, no container.

4. **Product Card**: #f0f1ef background, 0px radius, 20px padding. Product photo fills card width. Product name below in 16px Nimbus Sans 700, #000000. Price in 16px Nimbus Sans 400, #000000. No shadow, no border.

5. **Editorial Section Headline**: 'Lifecycle assessment results: Proven better' at 56px Nimbus Sans 700, #000000, line-height 1.00, letter-spacing -0.01em. Positioned within a grid cell defined by 1px black hairline dividers. No background, no container — the text sits directly on the white canvas.

## Similar Brands

- **Aesop** — Same editorial apothecary aesthetic — achromatic palette, oversized serif/sans typography, generous whitespace, product photography on neutral backgrounds, and hairline grid compositions
- **Mismo** — Scandinavian design language with bone-colored product cards, black-on-white typography, zero chromatic accents, and a gallery-like page structure with hairline dividers
- **Studio Bergini** — Extreme typographic minimalism where the wordmark itself functions as hero artwork, achromatic palette, and print-editorial layout rhythm with 1px structural lines
- **By Far** — High-contrast black-and-white ecommerce with oversized display type, sharp 0px radii, skeletal components, and full-bleed editorial photography

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-ink-black: #000000;
  --color-paper-white: #ffffff;
  --color-bone: #f0f1ef;
  --color-graphite: #333333;
  --color-ash: #d7d7d7;

  /* Typography — Font Families */
  --font-nimbus-sans-d-ot: 'Nimbus Sans D OT', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-helvetica: 'Helvetica', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 10px;
  --leading-caption: 1.2;
  --tracking-caption: 0.1px;
  --text-body: 16px;
  --leading-body: 1.4;
  --tracking-body: -0.16px;
  --text-subheading: 32px;
  --leading-subheading: 1;
  --tracking-subheading: -0.32px;
  --text-heading: 56px;
  --leading-heading: 1;
  --tracking-heading: -0.56px;
  --text-display: 80px;
  --leading-display: 1;
  --tracking-display: -0.8px;

  /* Typography — Weights */
  --font-weight-light: 300;
  --font-weight-regular: 400;
  --font-weight-bold: 700;

  /* Spacing */
  --spacing-unit: 4px;
  --spacing-4: 4px;
  --spacing-12: 12px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-36: 36px;
  --spacing-40: 40px;
  --spacing-60: 60px;
  --spacing-80: 80px;
  --spacing-180: 180px;

  /* Layout */
  --section-gap: 60-80px;
  --card-padding: 20px;
  --element-gap: 20px;

  /* Named Radii */
  --radius-cards: 0px;
  --radius-badges: 0px;
  --radius-inputs: 0px;
  --radius-buttons: 0px;

  /* Surfaces */
  --surface-page-canvas: #ffffff;
  --surface-card-surface: #f0f1ef;
  --surface-inverted-surface: #000000;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-ink-black: #000000;
  --color-paper-white: #ffffff;
  --color-bone: #f0f1ef;
  --color-graphite: #333333;
  --color-ash: #d7d7d7;

  /* Typography */
  --font-nimbus-sans-d-ot: 'Nimbus Sans D OT', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-helvetica: 'Helvetica', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 10px;
  --leading-caption: 1.2;
  --tracking-caption: 0.1px;
  --text-body: 16px;
  --leading-body: 1.4;
  --tracking-body: -0.16px;
  --text-subheading: 32px;
  --leading-subheading: 1;
  --tracking-subheading: -0.32px;
  --text-heading: 56px;
  --leading-heading: 1;
  --tracking-heading: -0.56px;
  --text-display: 80px;
  --leading-display: 1;
  --tracking-display: -0.8px;

  /* Spacing */
  --spacing-4: 4px;
  --spacing-12: 12px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-36: 36px;
  --spacing-40: 40px;
  --spacing-60: 60px;
  --spacing-80: 80px;
  --spacing-180: 180px;
}
```
