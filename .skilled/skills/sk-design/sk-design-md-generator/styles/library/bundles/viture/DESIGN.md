# VITURE — Style Reference
> neon product stage behind midnight glass — a blacked-out showroom where one orange beam cuts through the dark to illuminate a pair of glasses on a pedestal.

**Theme:** mixed

VITURE projects a premium consumer-electronics showroom: near-black canvases, photographic product stages lit with neon rim-lighting, and one searing orange accent (#ff5f34) that acts as the brand's heartbeat across links, emphasis text, and filled CTAs. The interface is intentionally restrained — a single custom geometric sans-serif (FontSeasonSans) carries the entire typographic voice, from 12px captions to 340px hero numerals, with positive letter-spacing that widens as type grows, giving display text an airy, almost holographic openness. Surfaces are flat and confident: pure white and pale grays for content cards, deep #0c0c0c for product showcases, and pill-shaped controls (9999px radius) that feel tactile and modern. Rounded cards (28px) and full-bleed gradient washes (orange-to-purple, blue-to-cyan) inject the futuristic XR energy without cluttering the UI.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| VITURE Ember | `#ff5f34` | `--color-viture-ember` | Brand accent, filled CTA buttons, active links, emphasis text, input focus — searing orange against matte black creates urgency and ownership of the brand voice |
| Crimson Core | `linear-gradient(90deg, #ff5f34 -100%, #f31010 0%, #ff5f34 100%)` | `--color-crimson-core` | Gradient midpoint for orange-red text washes and accent streaks |
| Aurora Wash | `linear-gradient(to right, #ff2900 0%, #fe7a60 61%, #581dff 100%)` | `--color-aurora-wash` | Gradient transition color in premium orange-to-violet washes (product banners, hero overlays) |
| Ultra Violet | `#581dff` | `--color-ultra-violet` | Gradient terminus for the orange-to-violet premium wash — appears only inside multi-stop gradients, not as a standalone token |
| Signal Blue | `linear-gradient(94deg, #1271ff 1.4%, #97dcff 80.11%, #e5f6ff 123.55%)` | `--color-signal-blue` | Gradient start for the cool-tech blue wash (secondary callouts, tech-feature banners) |
| Obsidian | `#0c0c0c` | `--color-obsidian` | Primary text, dark-section canvas, product showcase background, footer, solid black CTA variant — the structural near-black that frames every screen |
| Pure White | `#ffffff` | `--color-pure-white` | Light-section canvas, card surface, input background, inverse text on dark surfaces, modal surface |
| Ash | `#7e7e7f` | `--color-ash` | Body secondary text, helper text, placeholder copy, muted borders |
| Slate | `#5b5c5d` | `--color-slate` | Tertiary text, disabled labels, subdued metadata |
| Pewter | `#abacae` | `--color-pewter` | Hairline dividers, subtle borders, low-emphasis icon strokes |
| Fog | `#949597` | `--color-fog` | Disabled button background, muted UI chrome, neutral placeholder fill |
| Snow | `#f7f7f8` | `--color-snow` | Elevated card surface, subtle panel background, light section variation |
| Mist | `#eff0f3` | `--color-mist` | Inset card surface, nested panel background, alternating row tint |
| Void | `#000000` | `--color-void` | Deepest dark sections, modal overlay scrim, true-black accents |

## Tokens — Typography

### FontSeasonSans — Sole typeface across every UI surface — nav, body, headings, display numerals. The 340px size is a brand signature: oversized hero statistics and product superlatives rendered as visual anchors. Weights step from 400 body to 800 display, but display text rarely exceeds 700 because the massive size does the heavy lifting. Positive letter-spacing (0.012–0.050em) widens as type grows — the opposite of the negative-tracking trend, giving display copy an open, holographic, almost broadcast-poster feel appropriate to the XR hardware category. · `--font-fontseasonsans`
- **Substitute:** Inter, Satoshi, General Sans
- **Weights:** 400, 500, 600, 700, 800
- **Sizes:** 12, 14, 16, 20, 23, 28, 32, 60, 72, 105, 340
- **Line height:** 1.00–1.63 (tight 1.00–1.25 for display, relaxed 1.38–1.63 for body)
- **Letter spacing:** 0.0120em, 0.0200em, 0.0260em, 0.0500em
- **Role:** Sole typeface across every UI surface — nav, body, headings, display numerals. The 340px size is a brand signature: oversized hero statistics and product superlatives rendered as visual anchors. Weights step from 400 body to 800 display, but display text rarely exceeds 700 because the massive size does the heavy lifting. Positive letter-spacing (0.012–0.050em) widens as type grows — the opposite of the negative-tracking trend, giving display copy an open, holographic, almost broadcast-poster feel appropriate to the XR hardware category.

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 12px | 1.5 | 0.14px | `--text-caption` |
| body-sm | 14px | 1.5 | 0.17px | `--text-body-sm` |
| body | 16px | 1.63 | 0.19px | `--text-body` |
| subheading | 20px | 1.4 | 0.4px | `--text-subheading` |
| heading-sm | 23px | 1.38 | 0.46px | `--text-heading-sm` |
| heading-lg | 32px | 1.33 | 0.83px | `--text-heading-lg` |
| display | 60px | 1.2 | 1.56px | `--text-display` |
| display-lg | 72px | 1.2 | 3.6px | `--text-display-lg` |
| hero | 105px | 1 | 5.25px | `--text-hero` |
| mega | 340px | 1 | 17px | `--text-mega` |

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
| 28 | 28px | `--spacing-28` |
| 32 | 32px | `--spacing-32` |
| 40 | 40px | `--spacing-40` |
| 44 | 44px | `--spacing-44` |
| 48 | 48px | `--spacing-48` |
| 60 | 60px | `--spacing-60` |
| 80 | 80px | `--spacing-80` |
| 100 | 100px | `--spacing-100` |
| 120 | 120px | `--spacing-120` |
| 140 | 140px | `--spacing-140` |

### Border Radius

| Element | Value |
|---------|-------|
| cards | 28px |
| badges | 9999px |
| images | 28px |
| inputs | 16px |
| buttons | 9999px |
| hero-pill | 120px |

### Shadows

| Name | Value | Token |
|------|-------|-------|
| sm | `rgba(0, 0, 0, 0.1) 0px 4px 6px -1px, rgba(0, 0, 0, 0.1) 0...` | `--shadow-sm` |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 80px
- **Card padding:** 28px
- **Element gap:** 16px

## Components

### Pill CTA Button (Filled — Orange)
**Role:** Primary action across the site

9999px radius pill, background #ff5f34, text #ffffff, FontSeasonSans 500–600 at 16px, padding 22px vertical × 24px horizontal. Hovers darken toward #f31010 or add a subtle inner glow. Used for 'Buy Now', 'Add to Cart', 'Claim Offer' in the brand voice.

### Pill CTA Button (Filled — Black)
**Role:** Alternate solid CTA on light surfaces and inside modals

9999px radius pill, background #0c0c0c, text #ffffff, FontSeasonSans 600 at 16px, padding 22px × 24px. Appears in the subscribe modal as 'Claim 10% OFF Now'. Carries a single soft shadow: rgba(0,0,0,0.1) 0 4px 6px -1px, rgba(0,0,0,0.1) 0 2px 4px -2px.

### Ghost / Outlined Button
**Role:** Secondary action

9999px radius pill, 1px border #0c0c0c or #ffffff depending on surface, transparent background, text in matching color, 16px FontSeasonSans 500. Used for 'Learn More', 'Cancel', and tertiary actions.

### Email Input Field
**Role:** Newsletter capture, account email, contact form

16px border radius, 1px border #e5e5e5 (derived from Pewter), background #ffffff, padding 16px vertical × 24px horizontal. Placeholder text in #7e7e7f at 16px. Focus state shifts border to #ff5f34 with a 2px outer ring at rgba(255,95,52,0.2). A small envelope icon sits flush-right in #7e7e7f.

### Product Hero Card
**Role:** Showcase a single VITURE device or product family

28px border radius, background #0c0c0c or gradient-wash image, full-bleed product photography with neon rim-lighting. Internal padding 44px. Caption and product name sit at 14–20px FontSeasonSans 500 in #ffffff overlaid on the dark surface.

### Feature / Spec Card
**Role:** Highlight a product feature, spec, or benefit

28px border radius, background #f7f7f8 or #ffffff with 1px border #eff0f3. Padding 28px. Icon at 24px in #0c0c0c sits above a 20px FontSeasonSans 600 heading and 14px #7e7e7f body copy. No drop shadow — surface differentiation is flat and modern.

### Subscribe / Newsletter Modal
**Role:** Email capture overlay

Max-width 720px, split-pane layout: left half #ffffff with form, right half dark product image or gradient wash. Overall 16–24px radius (no pill). Close X in top-right at 16px FontSeasonSans 500 #0c0c0c. Carousel dots in the bottom-right of the image half at 8px circles, active = #ff5f34, inactive = rgba(255,255,255,0.4).

### Cookie Consent Bar
**Role:** GDPR / cookie notice pinned to viewport bottom

Full-width band, background #0c0c0c, text #ffffff at 14px FontSeasonSans 400, padding 16px vertical. 'Privacy Policy' link rendered in #ff5f34 with underline. Close X in #ffffff at 16px on the far right.

### Gradient Text Accent
**Role:** Headline or keyword emphasis inside hero sections

FontSeasonSans 700–800 at 32–72px. Background-clip: text with the linear-gradient(90deg, #ff5f34 -100%, #f31010 0%, #ff5f34 100%) wash. Used for 'The Best Just Got Better' and similar brand superlatives on dark image backgrounds.

### Navigation Pill Link
**Role:** Top-bar navigation items

9999px radius, padding 8px × 16px, FontSeasonSans 500 at 14px, text #0c0c0c on light nav. Hover fills background with #f7f7f8. Active state text shifts to #ff5f34.

### Carousel Indicator Dots
**Role:** Pagination for image carousels and modal slides

8px circles, 8px gap. Active dot #ff5f34, inactive rgba(255,255,255,0.4) on dark image backgrounds or #abacae on light surfaces. Centered or bottom-right aligned.

### Product Badge / Tag
**Role:** Status, category, or promotional labels

9999px radius pill, padding 4px × 12px, FontSeasonSans 600 at 12px, uppercase. Variants: 'NEW' (#ff5f34 background, #ffffff text), 'CNET 2024 Award' (#0c0c0c background, #ff5f34 text), 'Limited' (#ffffff background, #0c0c0c text with 1px border).

### Feature Highlight Banner
**Role:** Full-width promotional or feature strip with gradient

Full-bleed band, height auto with 60–80px vertical padding, background the orange-to-violet linear-gradient(90deg, #ff2900, #fe7a60, #581dff). Text in #ffffff at 28–60px FontSeasonSans 600–700. Sits between content sections as a brand-energy break.

### Close Icon Button
**Role:** Dismiss modals, banners, and overlays

32×32px hit target, 16px '×' glyph in FontSeasonSans 500. Color matches surface: #0c0c0c on light, #ffffff on dark. No background or border — pure ghost control.

## Do's and Don'ts

### Do
- Use #ff5f34 as the filled CTA background, active link color, and brand-emphasis text — it is the only chromatic color permitted for interactive elements
- Render all buttons, badges, and tag-like elements at 9999px radius — pill geometry is a system signature
- Use FontSeasonSans at 400 for body (16px, line-height 1.63) and at 600–700 for display (28–105px) — never substitute the typeface
- Apply the orange-red gradient wash (linear-gradient(90deg, #ff5f34 -100%, #f31010 0%, #ff5f34 100%)) to large display headlines via background-clip: text for brand-superlative moments
- Anchor product imagery on #0c0c0c or full-bleed gradient surfaces — never place photography on light or busy backgrounds
- Maintain 80px section gaps and 16px element gaps for the comfortable density rhythm; tighten to 8px only within inline icon clusters
- Use surface-color shifts (#ffffff → #f7f7f8 → #eff0f3) and 1px Pewter hairlines for hierarchy — avoid adding drop shadows to cards or panels

### Don't
- Don't introduce secondary accent colors — the palette is monochrome (black/white/grays) with one orange accent; adding blue, green, or purple as standalone tokens breaks the system
- Don't use negative letter-spacing on display text — the system intentionally widens tracking as type grows (up to +5.25px at 105px and +17px at 340px); tightening it kills the holographic signature
- Don't render the 340px mega-display on small viewports without a fluid clamp — at mobile sizes it will dominate the layout
- Don't add drop shadows to cards, modals, or panels — elevation is reserved for the solid black CTA and modal scrim only
- Don't use square or lightly-rounded corners (4–8px) on primary surfaces — cards are 28px, buttons are pills, and any intermediate radius reads as off-system
- Don't place body text below 16px or above 60px without the corresponding line-height and letter-spacing token — the type scale is strict, not interpolated
- Don't use the orange-to-violet gradient on small UI elements — it is a full-bleed banner treatment only; on chips or buttons it loses its premium effect

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Light Canvas | `#ffffff` | Base page background for content sections, product detail pages, and the light half of split layouts |
| 1 | Snow Card | `#f7f7f8` | First elevation lift — feature cards, spec panels, light promotional blocks |
| 2 | Mist Inset | `#eff0f3` | Nested panel or alternating row tint inside a Snow Card |
| 3 | Obsidian Stage | `#0c0c0c` | Dark product showcase sections, footer, hero backdrops, dramatic product photography canvas |
| 4 | Void Overlay | `#000000` | Modal scrim, image-bordered dark panels, deepest accent surfaces |

## Elevation

- **Filled Black Pill Button:** `rgba(0, 0, 0, 0.1) 0px 4px 6px -1px, rgba(0, 0, 0, 0.1) 0px 2px 4px -2px`

## Imagery

Photography is the hero content type: dramatic, full-bleed product shots of VITURE AR glasses against pure black, lit with neon orange and electric-blue rim-lights that echo the brand's accent colors. Shots are tight crops — the glasses fill the frame, often angled to catch reflections of neon sources. Lifestyle photography is minimal; the product itself, treated as sculpture, carries the visual weight. No flat illustrations or iconographic graphics — vector content is limited to thin-stroke UI icons (16–24px) in #0c0c0c or #ffffff. Image treatment is consistent: high-contrast, slightly underexposed backgrounds, saturated accent highlights, no duotone overlays or color grading filters — the lighting is baked into the original capture. A second visual layer uses the brand's signature orange-to-violet gradient as a full-bleed background for promotional banners, providing energy between content blocks.

## Layout

VITURE uses a max-width 1200px centered container for content sections, with full-bleed dark product showcases breaking out to the viewport edges. The hero is a split-screen composition: oversized headline (60–105px) on the left in #0c0c0c, product photography on the right filling 50–60% of the viewport width. Below the hero, sections alternate between light (#ffffff) and dark (#0c0c0c) bands at 80px vertical gaps, creating a rhythmic light/dark cadence. Feature sections use 3-column card grids (28px radius cards, 16px gaps) on light backgrounds. Specs and technical detail sections use a 2-column text-plus-image layout, alternating left/right. The navigation is a minimal top bar with a centered logo and pill-shaped links, no mega-menu. Footer is full-width #0c0c0c with multi-column link lists. The subscribe modal is centered in the viewport with a 720px max-width split-pane (form left, product image right). Cookie consent bar pins to the viewport bottom. Overall density is comfortable and product-forward — every section earns its vertical space with either a product reveal, a feature claim, or a visual gradient break.

## Agent Prompt Guide

**Quick Color Reference**
- text: #0c0c0c (primary), #7e7e7f (secondary), #ffffff (on dark)
- background: #ffffff (light canvas), #0c0c0c (dark stage), #f7f7f8 (card surface)
- border: #abacae (hairline), #eff0f3 (subtle panel)
- accent: #ff5f34 (brand ember)
- primary action: #ff5f34 (filled action)
- gradient text: linear-gradient(90deg, #ff5f34 -100%, #f31010 0%, #ff5f34 100%)

**3-5 Example Component Prompts**
1. Create a Primary Action Button: #ff5f34 background, #0c0c0c text, 9999px radius, compact pill padding. Use this filled treatment for the main CTA.
2. Create a product hero card: 28px border radius, background #0c0c0c, full-bleed product photograph with neon rim-lighting, internal padding 44px, product name overlay in #ffffff FontSeasonSans 600 at 20px bottom-left, 'NEW' badge (9999px pill, #ff5f34 background, #ffffff text, 12px FontSeasonSans 600) top-left.
3. Create an email input: 16px border radius, 1px border #abacae, background #ffffff, padding 16px × 24px, placeholder 'Email' in #7e7e7f FontSeasonSans 400 at 16px, envelope icon flush-right in #7e7e7f, focus state shifts border to #ff5f34 with 2px outer ring at rgba(255,95,52,0.2).
4. Create a feature spec card: 28px border radius, background #f7f7f8, padding 28px, 24px icon in #0c0c0c top, heading FontSeasonSans 600 at 20px in #0c0c0c, body FontSeasonSans 400 at 14px in #7e7e7f, no drop shadow.
5. Create a gradient display headline: FontSeasonSans weight 700 at 72px, text fill via background-clip with linear-gradient(90deg, #ff5f34 -100%, #f31010 0%, #ff5f34 100%), letter-spacing 3.6px, on a #0c0c0c full-bleed background section with 80px vertical padding.

## Similar Brands

- **Nothing (nothing.tech)** — Same monochrome near-black canvas with a single vivid accent, oversized display numerals, and a dot-matrix typographic attitude — both lean on a custom geometric sans and product-as-sculpture photography
- **Beats by Dre** — Shared product-showcase aesthetic on pure black with neon rim-lighting, pill-shaped CTAs, and bold condensed display type used as visual anchors
- **Apple Vision Pro** — Both treat XR hardware as premium jewelry — large hero numbers, cinematic product crops, alternating light/dark bands, and minimal interface chrome
- **Bose** — Same pill-button geometry, black/white/orange palette logic, and 28px-radius card system for consumer-electronics feature blocks
- **Teenage Engineering** — Both use a custom geometric sans with unusually positive letter-spacing on display text, flat surface treatments, and product photography that treats the device as a graphic object

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-viture-ember: #ff5f34;
  --color-crimson-core: #f31010;
  --gradient-crimson-core: linear-gradient(90deg, #ff5f34 -100%, #f31010 0%, #ff5f34 100%);
  --color-aurora-wash: #fe7a60;
  --gradient-aurora-wash: linear-gradient(to right, #ff2900 0%, #fe7a60 61%, #581dff 100%);
  --color-ultra-violet: #581dff;
  --color-signal-blue: #1271ff;
  --gradient-signal-blue: linear-gradient(94deg, #1271ff 1.4%, #97dcff 80.11%, #e5f6ff 123.55%);
  --color-obsidian: #0c0c0c;
  --color-pure-white: #ffffff;
  --color-ash: #7e7e7f;
  --color-slate: #5b5c5d;
  --color-pewter: #abacae;
  --color-fog: #949597;
  --color-snow: #f7f7f8;
  --color-mist: #eff0f3;
  --color-void: #000000;

  /* Typography — Font Families */
  --font-fontseasonsans: 'FontSeasonSans', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.5;
  --tracking-caption: 0.14px;
  --text-body-sm: 14px;
  --leading-body-sm: 1.5;
  --tracking-body-sm: 0.17px;
  --text-body: 16px;
  --leading-body: 1.63;
  --tracking-body: 0.19px;
  --text-subheading: 20px;
  --leading-subheading: 1.4;
  --tracking-subheading: 0.4px;
  --text-heading-sm: 23px;
  --leading-heading-sm: 1.38;
  --tracking-heading-sm: 0.46px;
  --text-heading-lg: 32px;
  --leading-heading-lg: 1.33;
  --tracking-heading-lg: 0.83px;
  --text-display: 60px;
  --leading-display: 1.2;
  --tracking-display: 1.56px;
  --text-display-lg: 72px;
  --leading-display-lg: 1.2;
  --tracking-display-lg: 3.6px;
  --text-hero: 105px;
  --leading-hero: 1;
  --tracking-hero: 5.25px;
  --text-mega: 340px;
  --leading-mega: 1;
  --tracking-mega: 17px;

  /* Typography — Weights */
  --font-weight-regular: 400;
  --font-weight-medium: 500;
  --font-weight-semibold: 600;
  --font-weight-bold: 700;
  --font-weight-extrabold: 800;

  /* Spacing */
  --spacing-unit: 4px;
  --spacing-4: 4px;
  --spacing-8: 8px;
  --spacing-12: 12px;
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-28: 28px;
  --spacing-32: 32px;
  --spacing-40: 40px;
  --spacing-44: 44px;
  --spacing-48: 48px;
  --spacing-60: 60px;
  --spacing-80: 80px;
  --spacing-100: 100px;
  --spacing-120: 120px;
  --spacing-140: 140px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 80px;
  --card-padding: 28px;
  --element-gap: 16px;

  /* Border Radius */
  --radius-2xl: 16px;
  --radius-3xl: 24px;
  --radius-3xl-2: 28px;
  --radius-full: 50px;
  --radius-full-2: 120px;
  --radius-full-3: 9999px;

  /* Named Radii */
  --radius-cards: 28px;
  --radius-badges: 9999px;
  --radius-images: 28px;
  --radius-inputs: 16px;
  --radius-buttons: 9999px;
  --radius-hero-pill: 120px;

  /* Shadows */
  --shadow-sm: rgba(0, 0, 0, 0.1) 0px 4px 6px -1px, rgba(0, 0, 0, 0.1) 0px 2px 4px -2px;

  /* Surfaces */
  --surface-light-canvas: #ffffff;
  --surface-snow-card: #f7f7f8;
  --surface-mist-inset: #eff0f3;
  --surface-obsidian-stage: #0c0c0c;
  --surface-void-overlay: #000000;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-viture-ember: #ff5f34;
  --color-crimson-core: #f31010;
  --color-aurora-wash: #fe7a60;
  --color-ultra-violet: #581dff;
  --color-signal-blue: #1271ff;
  --color-obsidian: #0c0c0c;
  --color-pure-white: #ffffff;
  --color-ash: #7e7e7f;
  --color-slate: #5b5c5d;
  --color-pewter: #abacae;
  --color-fog: #949597;
  --color-snow: #f7f7f8;
  --color-mist: #eff0f3;
  --color-void: #000000;

  /* Typography */
  --font-fontseasonsans: 'FontSeasonSans', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.5;
  --tracking-caption: 0.14px;
  --text-body-sm: 14px;
  --leading-body-sm: 1.5;
  --tracking-body-sm: 0.17px;
  --text-body: 16px;
  --leading-body: 1.63;
  --tracking-body: 0.19px;
  --text-subheading: 20px;
  --leading-subheading: 1.4;
  --tracking-subheading: 0.4px;
  --text-heading-sm: 23px;
  --leading-heading-sm: 1.38;
  --tracking-heading-sm: 0.46px;
  --text-heading-lg: 32px;
  --leading-heading-lg: 1.33;
  --tracking-heading-lg: 0.83px;
  --text-display: 60px;
  --leading-display: 1.2;
  --tracking-display: 1.56px;
  --text-display-lg: 72px;
  --leading-display-lg: 1.2;
  --tracking-display-lg: 3.6px;
  --text-hero: 105px;
  --leading-hero: 1;
  --tracking-hero: 5.25px;
  --text-mega: 340px;
  --leading-mega: 1;
  --tracking-mega: 17px;

  /* Spacing */
  --spacing-4: 4px;
  --spacing-8: 8px;
  --spacing-12: 12px;
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-28: 28px;
  --spacing-32: 32px;
  --spacing-40: 40px;
  --spacing-44: 44px;
  --spacing-48: 48px;
  --spacing-60: 60px;
  --spacing-80: 80px;
  --spacing-100: 100px;
  --spacing-120: 120px;
  --spacing-140: 140px;

  /* Border Radius */
  --radius-2xl: 16px;
  --radius-3xl: 24px;
  --radius-3xl-2: 28px;
  --radius-full: 50px;
  --radius-full-2: 120px;
  --radius-full-3: 9999px;

  /* Shadows */
  --shadow-sm: rgba(0, 0, 0, 0.1) 0px 4px 6px -1px, rgba(0, 0, 0, 0.1) 0px 2px 4px -2px;
}
```
