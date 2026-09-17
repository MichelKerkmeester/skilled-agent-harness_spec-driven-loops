# sweetgreen — Style Reference
> farm-stand chalkboard at golden hour

**Theme:** light

Sweetgreen's design system is a warm, farm-stand-meets-modern-typography aesthetic: a cream canvas (#f4f3e7) rooted in natural materials, with deep forest green as the structural anchor and electric lime (#e6ff55) as a singular, high-energy action color. Photography carries the brand — saturated, overhead food shots on warm tile, ceramic, and concrete surfaces are treated as heroes, never as decoration. Typography does the heavy lifting on chrome: a custom geometric sans (SweetSans) renders oversized category labels and hero headlines at extreme weights (400 at 70–80px, with 0.85 line-height that lets letters nearly touch), while a secondary ultra-light display face (Grenette at 200) creates contrast through restraint. Components are deliberately spare — pill-shaped buttons, ghost text links with arrows, badge-free product cards — letting the food and the headline typography own every screen.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Deep Forest | `#00473c` | `--color-deep-forest` | Primary brand color, nav logo, dark pill buttons, text accents, badge borders, link colors — the structural green that anchors the palette |
| Lime Glow | `#e6ff55` | `--color-lime-glow` | Green action color for filled buttons, selected navigation states, and focused conversion moments. |
| Sage Mist | `#d8e5d6` | `--color-sage-mist` | Section backgrounds, card surfaces, content band alternation — soft botanical green that signals freshness without competing with the food photography |
| Warm Sand | `#e8dcc6` | `--color-warm-sand` | Accent surface for alternate section bands — warm beige that pairs with food photography and adds earthy variety to the green-dominant palette |
| Cream Canvas | `#f4f3e7` | `--color-cream-canvas` | Primary page background, the warm off-white that gives the entire system its organic, non-clinical feel |
| Forest Shadow | `#0e150e` | `--color-forest-shadow` | Primary text color, borders, input strokes — near-black with a barely-perceptible green undertone that harmonizes with the brand greens |
| Pure Ink | `#000000` | `--color-pure-ink` | Maximum-contrast text, hairlines, icon strokes — used where absolute sharpness is needed |
| Warm Gray | `#8c8c82` | `--color-warm-gray` | Medium-contrast borders, control outlines, and structural separators. Do not promote it to the primary CTA color |
| Slate Gray | `#555555` | `--color-slate-gray` | Secondary text in disabled or low-emphasis button contexts |

## Tokens — Typography

### SweetSans — Display headlines, hero text, large category labels — used at extreme sizes (70–80px) with tight leading (0.85) that lets letterforms nearly touch; weight 400 at this size is the signature choice, creating a calm authority that doesn't shout · `--font-sweetsans`
- **Substitute:** Dazzed, Supreme, or NB Architekt as a geometric grotesque alternative
- **Weights:** 400
- **Sizes:** 40px, 70px, 80px
- **Line height:** 0.85–1.00
- **Role:** Display headlines, hero text, large category labels — used at extreme sizes (70–80px) with tight leading (0.85) that lets letterforms nearly touch; weight 400 at this size is the signature choice, creating a calm authority that doesn't shout

### Grenette — Secondary display accent — ultra-thin weight with extreme negative tracking creates a delicate, editorial counterpoint to the geometric SweetSans display · `--font-grenette`
- **Substitute:** Migra, Canela, or Editorial New as a thin editorial serif/grotesque alternative
- **Weights:** 200
- **Sizes:** 48px
- **Line height:** 1.00
- **Letter spacing:** -0.047em
- **Role:** Secondary display accent — ultra-thin weight with extreme negative tracking creates a delicate, editorial counterpoint to the geometric SweetSans display

### SweetSansText — Body text, navigation, button labels, card descriptions, footers — positive tracking (0.01–0.05em) improves readability at small sizes; weight 700 for labels and CTAs, 400 for body · `--font-sweetsanstext`
- **Substitute:** Söhne, Inter, or GT America as a geometric grotesque alternative
- **Weights:** 400, 700
- **Sizes:** 12px, 14px, 16px, 18px, 20px, 24px
- **Line height:** 1.20–1.38
- **Letter spacing:** 0.01em at 12–14px, 0.017em at 16px, 0.03em at 20px, 0.05em at 24px
- **Role:** Body text, navigation, button labels, card descriptions, footers — positive tracking (0.01–0.05em) improves readability at small sizes; weight 700 for labels and CTAs, 400 for body

### SweetSansText-Regular — Small UI text, micro-labels, fine print — the regular-weight variant for the smallest readable sizes · `--font-sweetsanstext-regular`
- **Substitute:** Söhne, Inter
- **Weights:** 400
- **Sizes:** 12px, 14px
- **Line height:** 1.29–1.33
- **Letter spacing:** 0.017em
- **Role:** Small UI text, micro-labels, fine print — the regular-weight variant for the smallest readable sizes

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 12px | 1.33 | 0.2px | `--text-caption` |
| body-sm | 14px | 1.29 | 0.24px | `--text-body-sm` |
| body | 16px | 1.25 | 0.27px | `--text-body` |
| body-lg | 18px | 1.33 | 0.54px | `--text-body-lg` |
| subheading | 20px | 1.2 | 0.6px | `--text-subheading` |
| heading-sm | 24px | 1.21 | 1.2px | `--text-heading-sm` |
| heading | 40px | 0.85 | — | `--text-heading` |
| heading-lg | 48px | 1 | -2.26px | `--text-heading-lg` |
| display | 70px | 0.85 | — | `--text-display` |
| display-lg | 80px | 1 | — | `--text-display-lg` |

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
| 40 | 40px | `--spacing-40` |
| 60 | 60px | `--spacing-60` |

### Border Radius

| Element | Value |
|---------|-------|
| cards | 24px |
| small | 4px |
| badges | 20px |
| images | 20px |
| inputs | 8px |
| buttons | 9999px |

### Shadows

| Name | Value | Token |
|------|-------|-------|
| xl | `rgba(14, 21, 14, 0.4) 3px 3px 32px -10px` | `--shadow-xl` |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 80px
- **Card padding:** 24px
- **Element gap:** 8px

## Components

### Pill CTA Button (Lime Fill)
**Role:** Primary action button — used for 'Order Now', 'Add to Bag', and any conversion action

Fully rounded (9999px) pill shape, #e6ff55 background, #0e150 text in SweetSansText weight 700 at 16–18px with 0.017em tracking, padding 16px 24px. The lime fill against the cream canvas creates the highest-contrast functional element on any page.

### Pill Outline Button (Forest Border)
**Role:** Secondary or navigation action — used for nav 'ORDER' pill, secondary CTAs

Fully rounded (9999px) pill, transparent or cream fill, 2px #00473c border, #00473c text in SweetSansText weight 700 at 16px, padding 12px 20px. Outlined rather than filled to maintain a lighter visual weight than the primary CTA.

### Ghost Text Link
**Role:** Inline action link — used for 'Order now →' on product cards, footer links, inline CTAs

No background, no border, #0e150 text in SweetSansText weight 700 at 16px, right-arrow glyph appended. Underline on hover only. The arrow is the visual anchor.

### Navigation Bar
**Role:** Top-level site navigation — persistent across all pages

Horizontal bar on #f4f3e7 background, centered logo 'sweetgreen' in #00473c at 24–28px SweetSansText weight 700, nav items flanking in SweetSansText weight 700 at 14px with 0.05em tracking, all-caps. Right-side 'ORDER' item rendered as a Pill Outline Button in #00473c.

### Menu Category Tab
**Role:** Section filter for menu browsing — 'Salads', 'Warm Bowls', 'Sides'

Large text-only tab, no border, no background change between states. Active tab: #0e150 in SweetSans at 40px weight 400 with a small dot indicator beneath. Inactive: #0e150 at 40px with no indicator. The typographic scale itself is the navigation signal.

### Product Card
**Role:** Menu item display — one card per food item in the browsing grid

Top: square food photograph with 20px border-radius. Below image: 24px padding, product name in SweetSansText weight 700 at 20px #0e150, 8px gap, description in SweetSansText weight 400 at 16px #0e150 with 1.25 line-height, 16px gap, 'Order now →' Ghost Text Link. No card background, no border, no shadow — the photograph IS the card surface.

### Online Only Badge
**Role:** Availability indicator on exclusive digital products

Absolute-positioned top-left of product card, #e6ff55 background, #0e150 text in SweetSansText weight 700 at 12px all-caps with 0.05em tracking, padding 4px 12px, 20px border-radius. Small, bright, unmissable.

### Full-Bleed Hero with Text Overlay
**Role:** Landing page hero — single product or campaign feature

Full-viewport-width photograph (no border-radius) as the background layer. Semi-transparent text overlay panel in cream (#f4f3e7 at ~90% opacity) anchored bottom-left, 40px padding, containing: small-caps eyebrow text in SweetSansText weight 700 at 14px, 8px gap, product name in SweetSans at 70–80px weight 400 line-height 0.85, 24px gap, Pill CTA Button (Lime Fill).

### Split Content Section
**Role:** Feature/editorial content — catering, about, mission sections

Two-column layout on a Sage Mist or Warm Sand section background. Left column: text stack with large display headline in SweetSans at 48–70px weight 400, 24px gap, structured sub-sections with bolded labels in SweetSansText weight 700 at 18px and body text in weight 400 at 16px. Right column: single full-bleed photograph with 20px border-radius. Generous 80–120px vertical padding.

### Eyebrow Label
**Role:** Pre-headline context label — 'SUNSHINE IN A SALAD', section identifiers

All-caps, SweetSansText weight 700 at 14px, 0.05em tracking, #0e150 or #00473c. Positioned 16–24px above the headline it qualifies. Functions as a typographic subtitle that adds context without visual weight.

### Food Photograph (Standard)
**Role:** Product and editorial photography

Overhead or 3/4 angle shots, high saturation, warm natural lighting. Rounded corners at 20px. No overlays, no text burned in. Full-bleed within their container — the food is the entire visual.

## Do's and Don'ts

### Do
- Use SweetSans at 70–80px weight 400 with 0.85 line-height for all primary display headlines — the weight-to-size ratio is the brand voice
- Default to #f4f3e7 as the page background; use #d8e5d6 or #e8dcc6 for alternating full-width content bands only
- Use #e6ff55 fill + #0e150 text exclusively for the primary action button — never invert the relationship
- Render all buttons as fully rounded pills (9999px radius) with 16px 24px padding and SweetSansText weight 700 at 16px
- Let food photography fill its container edge-to-edge with 20px border-radius — no frames, no borders, no overlays around images
- Use 'Order now →' as a Ghost Text Link (no background, arrow glyph) for all secondary product actions
- Apply positive letter-spacing (0.01–0.05em) to all text below 24px in SweetSansText for legibility

### Don't
- Don't use multiple accent colors — the palette is intentionally restricted to one lime (#e6ff55) and one forest green (#00473c) for action and brand respectively
- Don't set headlines in weight 700 or above — the brand's authority comes from the calm confidence of 400 at large sizes
- Don't add card backgrounds, borders, or drop shadows to product cards — the photograph is the card
- Don't use the lime (#e6ff55) for anything other than primary CTA fills and availability badges
- Don't use line-height above 1.0 for display type — the tight leading is what makes the headlines feel monumental
- Don't render buttons as rectangles, capsules, or with subtle radii — pill (9999px) is the only button shape
- Don't apply gradients — the system is entirely flat color, with warmth coming from the cream canvas and saturated photography

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Cream Canvas | `#f4f3e7` | Base page background — warm off-white that reads as organic rather than clinical |
| 1 | Sage Mist Band | `#d8e5d6` | Full-width content sections alternating with the canvas — calm botanical background for text-forward or split-layout content |
| 2 | Warm Sand Band | `#e8dcc6` | Alternate section background — earthy warm tone for visual rhythm variation |
| 3 | Lime Glow Highlight | `#e6ff55` | Accent surface for badges and CTA fills — the only chromatic surface that draws functional attention |
| 4 | Deep Forest Surface | `#00473c` | Dark accent surface for nav pills, dark-mode content blocks, or reversed text sections |

## Elevation

- **Product cards, CTA buttons:** `rgba(14, 21, 14, 0.4) 3px 3px 32px -10px`

## Imagery

Photography is the primary visual content. All images are high-saturation, overhead or 3/4-angle food photography shot in warm natural light, presented on organic surfaces (ceramic tile, concrete, wood, linen). Treatments are full-bleed within containers with consistent 20px border-radius — no frames, no borders, no decorative overlays. No illustrations, no abstract graphics, no 3D renders, no stock lifestyle photography. The food IS the visual content. Icons are minimal — line-based, single-weight strokes in #0e150, used only for functional UI (arrows, close, back). The 'ONLINE ONLY' badge is the only UI element that overlays photography directly.

## Layout

Full-bleed hero photography with bottom-left text overlay panel on the landing page. Max-width 1200px centered for all content sections. Section rhythm alternates between #f4f3e7 canvas and full-width #d8e5d6 or #e8dcc6 bands with 80–120px vertical padding. Menu grid uses a 3-column card layout with square product photographs. Editorial content sections use a 2-column split (text left, single full-bleed photograph right). Navigation is a single top bar — no sidebar, no mega-menu, no sticky behavior beyond the nav itself. Generous whitespace between sections creates a calm, gallery-like pacing where the food and typography can breathe.

## Agent Prompt Guide

## Quick Color Reference
- text: #0e150e
- background: #f4f3e7
- border: #0e150e or #00473c
- accent: #e6ff55 (Lime Glow)
- brand: #00473c (Deep Forest)
- surface alt: #d8e5d6 (Sage Mist)
- primary action: #e6ff55 (filled action)

## Example Component Prompts

1. Create a Primary Action Button: #e6ff55 background, #000000 text, 9999px radius, compact pill padding. Use this filled treatment for the main CTA.

2. **Product Card**: Square food photograph top, 20px border-radius. 24px padding below image. Product name in SweetSansText weight 700 at 20px, #0e150e. 8px gap. Description in SweetSansText weight 400 at 16px, #0e150e, 1.25 line-height. 16px gap. Ghost text link 'Order now →' in SweetSansText weight 700 at 16px, #0e150e. No card background, no border, no shadow.

3. **Menu Category Tabs**: Horizontal row of text-only tabs. Active tab: SweetSans weight 400 at 40px, #0e150e, with a 4px dot indicator below. Inactive tabs: same size and color, no dot. 40px gap between tabs. No borders, no backgrounds, no underlines.

4. **Split Feature Section**: Full-width #d8e5d6 background, 120px vertical padding. Two-column layout, max-width 1200px centered. Left column (50%): display headline in SweetSans weight 400 at 48px, #0e150e, line-height 1.0. 24px gap. Bolded sub-labels in SweetSansText weight 700 at 18px, #0e150e. Body text in SweetSansText weight 400 at 16px, #0e150e. Right column (50%): single photograph with 20px border-radius.

5. **Online Only Badge**: Absolute-positioned top-left of a product card image. #e6ff55 background, #0e150e text 'ONLINE ONLY' in SweetSansText weight 700 at 12px, all-caps, 0.05em tracking, 4px 12px padding, 20px border-radius.

## Similar Brands

- **Cava** — Same food-first photography strategy, warm neutral canvas, and pill-shaped CTAs with a single vivid accent color
- **Chobani** — Similar earthy warm palette with sage and cream tones, oversized custom display typography, and editorial food photography
- **Whole Foods Market** — Shared farm-stand warmth in the color palette and a commitment to letting product photography dominate over UI chrome
- **Goop** — Same approach of alternating full-width colored content bands with large custom display type and lifestyle photography
- **Olipop** — Similar pill-shaped buttons, cream canvas, and large geometric display headlines paired with saturated product photography

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-deep-forest: #00473c;
  --color-lime-glow: #e6ff55;
  --color-sage-mist: #d8e5d6;
  --color-warm-sand: #e8dcc6;
  --color-cream-canvas: #f4f3e7;
  --color-forest-shadow: #0e150e;
  --color-pure-ink: #000000;
  --color-warm-gray: #8c8c82;
  --color-slate-gray: #555555;

  /* Typography — Font Families */
  --font-sweetsans: 'SweetSans', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-grenette: 'Grenette', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-sweetsanstext: 'SweetSansText', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-sweetsanstext-regular: 'SweetSansText-Regular', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.33;
  --tracking-caption: 0.2px;
  --text-body-sm: 14px;
  --leading-body-sm: 1.29;
  --tracking-body-sm: 0.24px;
  --text-body: 16px;
  --leading-body: 1.25;
  --tracking-body: 0.27px;
  --text-body-lg: 18px;
  --leading-body-lg: 1.33;
  --tracking-body-lg: 0.54px;
  --text-subheading: 20px;
  --leading-subheading: 1.2;
  --tracking-subheading: 0.6px;
  --text-heading-sm: 24px;
  --leading-heading-sm: 1.21;
  --tracking-heading-sm: 1.2px;
  --text-heading: 40px;
  --leading-heading: 0.85;
  --text-heading-lg: 48px;
  --leading-heading-lg: 1;
  --tracking-heading-lg: -2.26px;
  --text-display: 70px;
  --leading-display: 0.85;
  --text-display-lg: 80px;
  --leading-display-lg: 1;

  /* Typography — Weights */
  --font-weight-extralight: 200;
  --font-weight-regular: 400;
  --font-weight-bold: 700;

  /* Spacing */
  --spacing-unit: 4px;
  --spacing-4: 4px;
  --spacing-8: 8px;
  --spacing-12: 12px;
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-40: 40px;
  --spacing-60: 60px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 80px;
  --card-padding: 24px;
  --element-gap: 8px;

  /* Border Radius */
  --radius-md: 4px;
  --radius-lg: 8px;
  --radius-lg-2: 11px;
  --radius-2xl: 20px;
  --radius-3xl: 24px;
  --radius-full: 1000px;

  /* Named Radii */
  --radius-cards: 24px;
  --radius-small: 4px;
  --radius-badges: 20px;
  --radius-images: 20px;
  --radius-inputs: 8px;
  --radius-buttons: 9999px;

  /* Shadows */
  --shadow-xl: rgba(14, 21, 14, 0.4) 3px 3px 32px -10px;

  /* Surfaces */
  --surface-cream-canvas: #f4f3e7;
  --surface-sage-mist-band: #d8e5d6;
  --surface-warm-sand-band: #e8dcc6;
  --surface-lime-glow-highlight: #e6ff55;
  --surface-deep-forest-surface: #00473c;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-deep-forest: #00473c;
  --color-lime-glow: #e6ff55;
  --color-sage-mist: #d8e5d6;
  --color-warm-sand: #e8dcc6;
  --color-cream-canvas: #f4f3e7;
  --color-forest-shadow: #0e150e;
  --color-pure-ink: #000000;
  --color-warm-gray: #8c8c82;
  --color-slate-gray: #555555;

  /* Typography */
  --font-sweetsans: 'SweetSans', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-grenette: 'Grenette', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-sweetsanstext: 'SweetSansText', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-sweetsanstext-regular: 'SweetSansText-Regular', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.33;
  --tracking-caption: 0.2px;
  --text-body-sm: 14px;
  --leading-body-sm: 1.29;
  --tracking-body-sm: 0.24px;
  --text-body: 16px;
  --leading-body: 1.25;
  --tracking-body: 0.27px;
  --text-body-lg: 18px;
  --leading-body-lg: 1.33;
  --tracking-body-lg: 0.54px;
  --text-subheading: 20px;
  --leading-subheading: 1.2;
  --tracking-subheading: 0.6px;
  --text-heading-sm: 24px;
  --leading-heading-sm: 1.21;
  --tracking-heading-sm: 1.2px;
  --text-heading: 40px;
  --leading-heading: 0.85;
  --text-heading-lg: 48px;
  --leading-heading-lg: 1;
  --tracking-heading-lg: -2.26px;
  --text-display: 70px;
  --leading-display: 0.85;
  --text-display-lg: 80px;
  --leading-display-lg: 1;

  /* Spacing */
  --spacing-4: 4px;
  --spacing-8: 8px;
  --spacing-12: 12px;
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-40: 40px;
  --spacing-60: 60px;

  /* Border Radius */
  --radius-md: 4px;
  --radius-lg: 8px;
  --radius-lg-2: 11px;
  --radius-2xl: 20px;
  --radius-3xl: 24px;
  --radius-full: 1000px;

  /* Shadows */
  --shadow-xl: rgba(14, 21, 14, 0.4) 3px 3px 32px -10px;
}
```
