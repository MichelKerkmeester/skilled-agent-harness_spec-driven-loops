# Felt — Style Reference
> topographic atlas at dusk — moss-green pages, serif headlines, one amber needle

**Theme:** dark

Felt renders as a cartographer's field journal at dusk: a deep mossy-green canvas carries oversized editorial serif headlines that feel pulled from a vintage atlas, while a grotesque sans handles utility text. The warm amber accent appears sparingly — a compass needle against the green — punctuating CTAs, links, and interactive borders without ever flooding the surface. Layout is centered, magazine-like, with generous breathing room and full-width product reveals that feel like fold-out map spreads. The visual rhythm alternates between typographic hero zones and embedded product UI, creating a sense of a working tool rather than a marketing site.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Moss Canvas | `#314218` | `--color-moss-canvas` | Page background, hero sections, dominant canvas — the deep mossy green that carries the entire site and grounds the editorial atmosphere |
| Fern | `#3d521e` | `--color-fern` | Mid-green surface for cards, elevated panels, and the topside of the surface stack |
| Lichen | `#64754b` | `--color-lichen` | Muted green for secondary surfaces, borders on cards, and subtle dividers against the canvas |
| Forest Floor | `#212f0c` | `--color-forest-floor` | Deeper green for nested surface layers and inset product UI backgrounds |
| Deep Bog | `#18210c` | `--color-deep-bog` | Darkest green for the deepest surface layer, code blocks, and high-contrast panels |
| Amber Compass | `#dc8c46` | `--color-amber-compass` | Primary action — filled CTA buttons, link borders, active link text. The single warm accent that cuts through the green monochrome like a compass needle |
| Bone White | `#ffffff` | `--color-bone-white` | Primary text, heading color, button text on amber fills, and the dominant border for ghost/outlined controls |
| Parchment | `#eeeeee` | `--color-parchment` | Light surface for embedded product UI, inset map views, and light-mode panel surfaces against the dark canvas |
| Charcoal | `#333333` | `--color-charcoal` | Text and borders inside the light parchment product UI panels — the dark-on-light text color for embedded app surfaces |
| Limestone | `#d8dcd2` | `--color-limestone` | Soft warm-tinted gray for badge backgrounds, subtle borders, and muted helper text inside light panels |
| Ink | `#000000` | `--color-ink` | SVG fills, max-contrast elements, and the map marker pin color |

## Tokens — Typography

### Arial — Arial — detected in extracted data but not described by AI · `--font-arial`
- **Weights:** 400
- **Sizes:** 14px, 16px
- **Line height:** 1.25, 1.33, 1.43
- **Role:** Arial — detected in extracted data but not described by AI

### GT Alpina Standard — Display and heading serif — the editorial headline face. Used at large sizes for hero headlines and section titles. The tight negative tracking (-0.033em to -0.040em) and line-height under 1.0 give the serif a compressed, almost carved-into-stone quality that evokes old cartographic title plates. This is the signature type choice: a humanist serif that feels hand-drawn rather than mechanical. · `--font-gt-alpina-standard`
- **Substitute:** Fraunces, Tiempos Headline, Playfair Display
- **Weights:** 300, 400
- **Sizes:** 28px, 36px, 43px, 46px, 50px, 86px
- **Line height:** 0.80, 0.96, 1.00, 1.11, 1.33
- **Letter spacing:** -0.0400em at 86px, -0.0330em at 36-50px
- **Role:** Display and heading serif — the editorial headline face. Used at large sizes for hero headlines and section titles. The tight negative tracking (-0.033em to -0.040em) and line-height under 1.0 give the serif a compressed, almost carved-into-stone quality that evokes old cartographic title plates. This is the signature type choice: a humanist serif that feels hand-drawn rather than mechanical.

### Atlas Grotesk — Primary UI and body sans-serif — handles navigation, body text, button labels, badges, and links. The slight positive tracking (0.033em) on body sizes adds legibility on the dark green canvas. The grotesque geometry provides a clean utility counterpoint to the expressive serif headlines. · `--font-atlas-grotesk`
- **Substitute:** Inter, Söhne, Helvetica Neue
- **Weights:** 300, 400, 500, 700
- **Sizes:** 12px, 14px, 16px, 18px, 19px, 20px
- **Line height:** 1.00, 1.11, 1.20, 1.25, 1.30, 1.33, 1.43, 1.50, 1.56
- **Letter spacing:** 0.0330em
- **Role:** Primary UI and body sans-serif — handles navigation, body text, button labels, badges, and links. The slight positive tracking (0.033em) on body sizes adds legibility on the dark green canvas. The grotesque geometry provides a clean utility counterpoint to the expressive serif headlines.

### Times New Roman — Fallback system serif at extreme display sizes. The 101px / 0.88 line-height ratio confirms the compressed display treatment for the largest headlines. · `--font-times-new-roman`
- **Substitute:** system serif
- **Weights:** 400
- **Sizes:** 36px, 101px
- **Line height:** 0.88, 2.46
- **Role:** Fallback system serif at extreme display sizes. The 101px / 0.88 line-height ratio confirms the compressed display treatment for the largest headlines.

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 12px | 1.43 | 0.4px | `--text-caption` |
| body-sm | 14px | 1.43 | 0.46px | `--text-body-sm` |
| body | 16px | 1.5 | 0.53px | `--text-body` |
| subheading | 19px | 1.33 | — | `--text-subheading` |
| heading-sm | 28px | 1.11 | -0.92px | `--text-heading-sm` |
| heading | 36px | 1 | -1.19px | `--text-heading` |
| heading-lg | 50px | 0.96 | -1.65px | `--text-heading-lg` |
| display | 86px | 0.88 | -3.44px | `--text-display` |

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
| 36 | 36px | `--spacing-36` |
| 48 | 48px | `--spacing-48` |
| 64 | 64px | `--spacing-64` |
| 72 | 72px | `--spacing-72` |
| 80 | 80px | `--spacing-80` |
| 120 | 120px | `--spacing-120` |
| 144 | 144px | `--spacing-144` |
| 160 | 160px | `--spacing-160` |

### Border Radius

| Element | Value |
|---------|-------|
| cards | 6px |
| badges | 6px |
| images | 6px |
| inputs | 6px |
| buttons | 20px |

### Shadows

| Name | Value | Token |
|------|-------|-------|
| sm | `rgba(0, 0, 0, 0.2) 0px 2px 5px 0px` | `--shadow-sm` |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 80px
- **Card padding:** 24px
- **Element gap:** 12px

## Components

### Amber CTA Button
**Role:** Primary action — filled button for conversion moments

Filled #dc8c46 background, white (#ffffff) text in Atlas Grotesk 16px weight 500, tracking 0.033em. 20px border-radius (pilled). Horizontal padding 20-24px, vertical padding 12-16px. No border. Includes a white play-arrow icon inline at the right.

### Ghost Link Button
**Role:** Secondary action — text link with underline border treatment

No fill, no border. Atlas Grotesk 16px weight 400, #ffffff text. Underline created by a 1px white bottom border. Used for "Book a demo" style secondary CTAs.

### Navigation Bar
**Role:** Top-level site navigation

Transparent on Moss Canvas. Felt wordmark in white serif at left. Nav items (PLATFORM, INDUSTRIES, RESOURCES, PRICING) in Atlas Grotesk 12px weight 500, uppercase, 0.033em tracking, white. Right side: "BOOK A DEMO" and "LOG IN" as ghost text links, "SIGN UP" as a filled Amber CTA with play icon.

### Hero Section
**Role:** Above-the-fold headline and CTA zone

Centered layout on Moss Canvas. Headline in GT Alpina Standard 86px weight 300, white, line-height 0.88, letter-spacing -3.44px. Subtitle in Atlas Grotesk 18px weight 400, #eeeeee. Two CTAs side by side: Amber CTA + Ghost Link.

### Scrolling Ticker Banner
**Role:** Top announcement bar

Full-width strip. White text on Moss Canvas (#314218). Atlas Grotesk 12px weight 500, uppercase, repeated headline text with separators. Sits above the navigation.

### Product UI Panel
**Role:** Embedded application screenshot / product surface

Light surface (#ffffff or #eeeeee) with rounded corners 6px. Dark text (#333333) inside. Subtle shadow rgba(0,0,0,0.2) 0px 2px 5px. Contains toolbars, map canvases, and library sidebars — mimics the actual Felt product.

### Client Logo Row
**Role:** Social proof — trusted-by brand logos

Horizontal row of client logos (Lyft, Lime, Turo, Cushman & Wakefield) rendered in white on Moss Canvas. Section title "Leading a modern GIS movement" in GT Alpina Standard 36px weight 300, white, centered above.

### Feature Section
**Role:** Mid-page content blocks with headline + product visual

Centered serif headline (GT Alpina Standard 36-50px, white) followed by Atlas Grotesk 18px subtext, then a full-width Product UI Panel below. Generous 80px vertical gap between sections.

### Badge / Tag
**Role:** Category labels and metadata tags

Limestone (#d8dcd2) background, small radius 6px, Atlas Grotesk 12px weight 500, 0.033em tracking. Minimal padding 2px 6px.

### Map Marker Pin
**Role:** Interactive map point indicator

#dc8c46 (Amber) circular pin with a white border, placed on the map canvas. Small drop shadow. Acts as the brand's visual signature on the product surface.

## Do's and Don'ts

### Do
- Use GT Alpina Standard weight 300 for all display and section headlines — the thin serif is the brand's most distinctive choice and must carry the editorial voice
- Set display headlines at 86px with line-height 0.88 and letter-spacing -3.44px for the compressed, carved-into-stone effect
- Use Amber Compass (#dc8c46) exclusively for filled CTAs and accent moments — never as a surface fill or decorative wash
- Step surfaces using the green scale: Moss Canvas (#314218) → Fern (#3d521e) → Lichen (#64754b) for elevation, not shadows
- Set body and UI text in Atlas Grotesk weight 400 with 0.033em letter-spacing for legibility on the dark green canvas
- Embed product UI panels in light surface (#ffffff) with 6px radius and the single subtle shadow to create contrast against the dark page
- Maintain centered, magazine-style layouts with 80px section gaps — the page rhythm should feel like turning pages in an atlas

### Don't
- Don't use Amber Compass (#dc8c46) for body text, backgrounds, or large surface areas — it loses its compass-needle effect when overused
- Don't set serif headlines at line-height above 1.0 — the compressed treatment is essential to the editorial feel
- Don't apply multiple shadow layers — Felt uses elevation through color stepping, not shadow stacks
- Don't use pure black (#000000) as a page background — the mossy green tones are the canvas, not black
- Don't replace GT Alpina Standard with a geometric or grotesque display face — the serif is the brand identity
- Don't use border-radius above 6px on cards, images, or product panels — only buttons get the 20px pill radius
- Don't introduce new accent hues — the entire palette is green monochrome plus one warm amber; any other color breaks the system

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Moss Canvas | `#314218` | Primary page background and hero zones |
| 1 | Fern | `#3d521` | First elevation — cards and content panels sitting on the canvas |
| 2 | Lichen | `#64754b` | Secondary surface for sub-cards and dividers |
| 3 | Bone White | `#ffffff` | Inverted product UI surfaces (embedded map app panels) |

## Elevation

- **Embedded product UI panels:** `rgba(0, 0, 0, 0.2) 0px 2px 5px 0px`

## Imagery

Imagery is dominated by embedded product screenshots showing the Felt map application — these are full-width, light-surface panels with real GIS map content (street maps, satellite views, data overlays, map markers). The product UI itself IS the hero imagery. No lifestyle photography, no stock imagery, no decorative illustration. The only non-product visual elements are topographic contour-line patterns in muted green (#64754b) that appear as background decoration on hero sections, evoking actual cartographic map texture. Client logos appear in white monochrome. The map marker pin (#dc8c46 with white border) serves as the brand's recurring visual signature across product surfaces.

## Layout

Centered, magazine-style page layout with max-width 1200px for content. Hero is full-bleed dark green with centered oversized serif headline, subtitle, and two side-by-side CTAs. Below the hero, a full-width embedded product UI panel breaks the layout to a wider reveal (like a fold-out map spread). Sections alternate between typographic hero zones (centered text, 80px vertical padding) and product reveal zones (full-width embedded app surfaces). A scrolling ticker banner sits at the very top. Navigation is a clean transparent bar overlaying the dark canvas. The page rhythm is: ticker → nav → hero headline → product reveal → social proof logos → feature section (headline + product) → repeating feature sections. All content is centered; no asymmetric or left-aligned compositions.

## Agent Prompt Guide

## Quick Color Reference
- Background (canvas): #314218 (Moss Canvas)
- Text: #ffffff (headings) / #eeeeee (body on dark)
- Border / divider: #64754b (Lichen) or #3d521e (Fern)
- Accent / brand: #dc8c46 (Amber Compass)
- Product surface: #ffffff (Bone White)
- primary action: #ffffff (filled action)

## Example Component Prompts

1. Create a Primary Action Button: #ffffff background, #eeeeee text, 9999px radius, compact pill padding. Use this filled treatment for the main CTA.

2. **Feature Section**: Moss Canvas background, centered content. Section headline: GT Alpina Standard 50px, weight 300, #ffffff, line-height 0.96, letter-spacing -1.65px, centered. Body text: Atlas Grotesk 18px, weight 400, #eeeeee, centered, max-width 720px. Below: full-width Product UI Panel — #ffffff surface, 6px border-radius, shadow rgba(0,0,0,0.2) 0px 2px 5px, containing a mock map interface with #333333 toolbar elements.

3. **Client Logo Row**: Moss Canvas background. Section title: GT Alpina Standard 36px, weight 300, #ffffff, centered. Below: horizontal row of 4–5 client logos in white monochrome, evenly spaced with 48px gaps, centered in the layout.

4. **Embedded Product Panel**: White (#ffffff) surface, 6px border-radius, shadow rgba(0,0,0,0.2) 0px 2px 5px 0px. Interior toolbar in #333333, Atlas Grotesk 14px. Map canvas fills the body. Amber map marker pin (#dc8c46 circle, 2px white border) at a notable location.


## Type & Tone

The visual voice is editorial-cartographic: think National Geographic meets a modern SaaS landing page. Serif headlines do the heavy emotional lifting while the grotesque sans handles all functional text. The amber accent acts as a compass needle — singular, precise, never decorative. Topographic contour-line patterns appear as background texture on hero sections to reinforce the mapping identity without resorting to literal map imagery. The overall effect should feel like opening a beautifully typeset atlas: authoritative, warm, and slightly adventurous.

## Similar Brands

- **Mapbox** — Both use dark canvas backgrounds with a single warm accent color and center their hero on embedded map product UI rather than abstract imagery
- **Notion** — Same editorial approach with oversized serif headlines on dark backgrounds, though Notion uses black rather than green canvas
- **Linear** — Dark monochromatic UI with one distinctive accent color, centered layouts, and serif/serif-adjacent display type for a premium editorial feel
- **Roam Research** — Both use nature-inspired dark canvas palettes (Roam uses deep navy, Felt uses moss green) with serif headlines and a single warm accent for interactive elements
- **Stamen Design** — Cartographic design studio aesthetic — mossy greens, topographic texture, and serif typography rooted in atlas and map traditions

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-moss-canvas: #314218;
  --color-fern: #3d521e;
  --color-lichen: #64754b;
  --color-forest-floor: #212f0c;
  --color-deep-bog: #18210c;
  --color-amber-compass: #dc8c46;
  --color-bone-white: #ffffff;
  --color-parchment: #eeeeee;
  --color-charcoal: #333333;
  --color-limestone: #d8dcd2;
  --color-ink: #000000;

  /* Typography — Font Families */
  --font-arial: 'Arial', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-gt-alpina-standard: 'GT Alpina Standard', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-atlas-grotesk: 'Atlas Grotesk', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-times-new-roman: 'Times New Roman', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.43;
  --tracking-caption: 0.4px;
  --text-body-sm: 14px;
  --leading-body-sm: 1.43;
  --tracking-body-sm: 0.46px;
  --text-body: 16px;
  --leading-body: 1.5;
  --tracking-body: 0.53px;
  --text-subheading: 19px;
  --leading-subheading: 1.33;
  --text-heading-sm: 28px;
  --leading-heading-sm: 1.11;
  --tracking-heading-sm: -0.92px;
  --text-heading: 36px;
  --leading-heading: 1;
  --tracking-heading: -1.19px;
  --text-heading-lg: 50px;
  --leading-heading-lg: 0.96;
  --tracking-heading-lg: -1.65px;
  --text-display: 86px;
  --leading-display: 0.88;
  --tracking-display: -3.44px;

  /* Typography — Weights */
  --font-weight-light: 300;
  --font-weight-regular: 400;
  --font-weight-medium: 500;
  --font-weight-bold: 700;

  /* Spacing */
  --spacing-unit: 4px;
  --spacing-4: 4px;
  --spacing-8: 8px;
  --spacing-12: 12px;
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-36: 36px;
  --spacing-48: 48px;
  --spacing-64: 64px;
  --spacing-72: 72px;
  --spacing-80: 80px;
  --spacing-120: 120px;
  --spacing-144: 144px;
  --spacing-160: 160px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 80px;
  --card-padding: 24px;
  --element-gap: 12px;

  /* Border Radius */
  --radius-md: 6px;
  --radius-lg: 10px;
  --radius-2xl: 20px;

  /* Named Radii */
  --radius-cards: 6px;
  --radius-badges: 6px;
  --radius-images: 6px;
  --radius-inputs: 6px;
  --radius-buttons: 20px;

  /* Shadows */
  --shadow-sm: rgba(0, 0, 0, 0.2) 0px 2px 5px 0px;

  /* Surfaces */
  --surface-moss-canvas: #314218;
  --surface-fern: #3d521;
  --surface-lichen: #64754b;
  --surface-bone-white: #ffffff;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-moss-canvas: #314218;
  --color-fern: #3d521e;
  --color-lichen: #64754b;
  --color-forest-floor: #212f0c;
  --color-deep-bog: #18210c;
  --color-amber-compass: #dc8c46;
  --color-bone-white: #ffffff;
  --color-parchment: #eeeeee;
  --color-charcoal: #333333;
  --color-limestone: #d8dcd2;
  --color-ink: #000000;

  /* Typography */
  --font-arial: 'Arial', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-gt-alpina-standard: 'GT Alpina Standard', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-atlas-grotesk: 'Atlas Grotesk', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-times-new-roman: 'Times New Roman', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.43;
  --tracking-caption: 0.4px;
  --text-body-sm: 14px;
  --leading-body-sm: 1.43;
  --tracking-body-sm: 0.46px;
  --text-body: 16px;
  --leading-body: 1.5;
  --tracking-body: 0.53px;
  --text-subheading: 19px;
  --leading-subheading: 1.33;
  --text-heading-sm: 28px;
  --leading-heading-sm: 1.11;
  --tracking-heading-sm: -0.92px;
  --text-heading: 36px;
  --leading-heading: 1;
  --tracking-heading: -1.19px;
  --text-heading-lg: 50px;
  --leading-heading-lg: 0.96;
  --tracking-heading-lg: -1.65px;
  --text-display: 86px;
  --leading-display: 0.88;
  --tracking-display: -3.44px;

  /* Spacing */
  --spacing-4: 4px;
  --spacing-8: 8px;
  --spacing-12: 12px;
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-36: 36px;
  --spacing-48: 48px;
  --spacing-64: 64px;
  --spacing-72: 72px;
  --spacing-80: 80px;
  --spacing-120: 120px;
  --spacing-144: 144px;
  --spacing-160: 160px;

  /* Border Radius */
  --radius-md: 6px;
  --radius-lg: 10px;
  --radius-2xl: 20px;

  /* Shadows */
  --shadow-sm: rgba(0, 0, 0, 0.2) 0px 2px 5px 0px;
}
```
