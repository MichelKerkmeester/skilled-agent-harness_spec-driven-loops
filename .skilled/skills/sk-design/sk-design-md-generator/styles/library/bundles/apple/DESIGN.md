# Apple — Style Reference
> white room with a single blue switch.

**Theme:** light

Apple's design language is a study in restraint: near-white canvas, generous breathing room, and one vivid blue accent that makes every action feel deliberate. Typography is the primary voice — SF Pro set with negative tracking that tightens as size grows, giving headlines architectural clarity without weight. The product IS the design: large product photography and lifestyle imagery dominate, while chrome recedes into thin borders, ghost navigation, and hairline rules. Sections alternate on a light gray canvas with full-bleed color washes for promotional blocks, creating rhythm through scale shifts rather than decoration.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Apple Blue | `#0071e3` | `--color-apple-blue` | Filled action buttons, selected states — the only chromatic interactive color, used sparingly so each appearance carries weight |
| Link Blue | `#0066cc` | `--color-link-blue` | Outlined action borders, inline links — deeper saturation than Apple Blue, used where a filled pill would be too loud |
| Signal Blue | `#2997ff` | `--color-signal-blue` | Decorative borders, image outlines, icon strokes — the lightest blue in the system, used for atmospheric emphasis rather than interaction |
| Carbon | `#1d1d1f` | `--color-carbon` | Primary text, heading borders, nav rules, card borders — the dominant ink color, near-black with a whisper of warmth |
| Frost | `#f5f5f7` | `--color-frost` | Page canvas, body backgrounds, footer surface — the signature Apple light gray, slightly cooler than pure white |
| Ice | `#f4f8fb` | `--color-ice` | Elevated surface washes, subtle fills, button text on dark backgrounds — barely-blue tint that lifts a section without declaring it |
| Smoke | `#333333` | `--color-smoke` | Secondary text, nav fills, button borders — the workhorse neutral for borders and icons that need more presence than mid-gray |
| Graphite | `#474747` | `--color-graphite` | Nav text, nav borders, link borders — sits between Carbon and Smoke for tertiary hierarchy |
| Ash | `#707070` | `--color-ash` | Footer text, list borders, nav borders, muted body text — the mid-gray for content that should be present but quiet |
| Mist | `#858585` | `--color-mist` | Body borders, icon strokes, button borders — the lightest functional gray, for hairline rules on light surfaces |
| Onyx | `#000000` | `--color-onyx` | Heading borders, nav borders, dark image backgrounds — true black for maximum contrast in promotional and heading contexts |
| Pebble | `#e2e2e5` | `--color-pebble` | Button background fills, disabled surfaces — the only near-white surface that is deliberately grayer than the canvas |

## Tokens — Typography

### SF Pro Display — Display headlines and large feature text — sizes 40px+ use the display cut for tighter aperture and stronger negative tracking; 700 reserved for promotional lockups, 400 for editorial product names · `--font-sf-pro-display`
- **Substitute:** Inter, system-ui
- **Weights:** 400, 600, 700
- **Sizes:** 21px, 28px, 40px, 56px
- **Line height:** 1.07, 1.10, 1.14, 1.19
- **Letter spacing:** -0.005em at 21px, 0.007em at 28px, 0.011em at 40px+
- **OpenType features:** `"numr"`
- **Role:** Display headlines and large feature text — sizes 40px+ use the display cut for tighter aperture and stronger negative tracking; 700 reserved for promotional lockups, 400 for editorial product names

### SF Pro Text — Body, navigation, buttons, subheads — the working typeface; 400 for body copy, 300 for subheads and refined labels, 600 for nav items and button text; negative tracking tightens proportionally with size (-0.022em at 12px down to -0.01em at 44px) · `--font-sf-pro-text`
- **Substitute:** Inter, system-ui
- **Weights:** 300, 400, 600
- **Sizes:** 12px, 14px, 17px, 18px, 24px, 26px, 34px, 44px
- **Line height:** 1.18, 1.24, 1.29, 1.33, 1.47, 1.50, 2.12, 2.41
- **Letter spacing:** -0.022em at 12px, -0.016em at 17px, -0.011em at 24px, -0.01em at 44px
- **Role:** Body, navigation, buttons, subheads — the working typeface; 400 for body copy, 300 for subheads and refined labels, 600 for nav items and button text; negative tracking tightens proportionally with size (-0.022em at 12px down to -0.01em at 44px)

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 12px | 1.33 | -0.264px | `--text-caption` |
| body-sm | 14px | 1.29 | -0.224px | `--text-body-sm` |
| body | 17px | 1.47 | -0.272px | `--text-body` |
| subheading | 21px | 1.24 | -0.105px | `--text-subheading` |
| heading-sm | 28px | 1.18 | 0.196px | `--text-heading-sm` |
| heading | 40px | 1.14 | 0.44px | `--text-heading` |
| heading-lg | 44px | 1.18 | -0.44px | `--text-heading-lg` |
| display | 56px | 1.07 | 0.616px | `--text-display` |

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
| 48 | 48px | `--spacing-48` |
| 56 | 56px | `--spacing-56` |

### Border Radius

| Element | Value |
|---------|-------|
| tags | 980px |
| cards | 8px |
| images | 8px |
| inputs | 8px |
| buttons | 980px |

### Shadows

| Name | Value | Token |
|------|-------|-------|
| xl | `rgba(0, 0, 0, 0.22) 3px 5px 30px 0px` | `--shadow-xl` |

### Layout

- **Page max-width:** 1440px
- **Section gap:** 64px
- **Card padding:** 24px
- **Element gap:** 12px

## Components

### Filled Pill Button
**Role:** Primary action — Buy, Learn more, Shop

980px border-radius, #0071e3 background, white (#f4f8fb) text at 17px weight 400, padding 11px 15px, no border, no shadow. The single filled interactive element in the system.

### Outlined Pill Button
**Role:** Secondary action — pair with filled primary

980px border-radius, 1px solid #0066cc border, #0066cc text at 17px weight 400, transparent fill, padding 11px 15px. Used as the second action next to a filled blue button.

### Ghost Link
**Role:** Tertiary action or inline text link

No background, no border, #0066cc text at inherit size, underline on hover only. Weight 400, same family as body.

### Global Nav Bar
**Role:** Top-level site navigation

Full-width, #1d1d1f or white background, 8px vertical padding, horizontal links at 12px weight 400 in #1d1d1f or #f5f5f7. Apple logo on left, product categories centered, search and bag icons on right. 1px hairline bottom border in #1d1d1f or #333.

### Sticky Mini-Nav
**Role:** Product page sub-navigation that pins below global nav

White background, product name in 21px weight 600 + colored wordmark, action links at 14px weight 400. 1px bottom border in #d2d2d7.

### Product Hero Section
**Role:** Full-bleed product showcase

#f5f5f7 background, centered product name at 56px weight 600 in #1d1d1f, tagline at 26px weight 300, two action buttons centered below. Large product render fills the section with generous bottom padding.

### Feature Banner
**Role:** Full-bleed promotional or service content

Full-width photographic or color-washed background, overlay text and CTA. Can be dark with white text, or a pastel wash with dark text. No card surface — the image IS the surface.

### Service Card Grid
**Role:** Multi-service promotional row (Apple TV+, Fitness+, Music, Arcade)

Horizontal scroll or grid of cards, each full-bleed photographic background, 8px radius, white text overlay. Card title 24-28px weight 600, genre label in 12-14px, pill action button (Listen now, Play now, Watch now) at bottom.

### Typography-Only CTA Block
**Role:** Compact product call-out within a section

Centered stack: product name at 40-56px weight 600, one-line descriptor at 21px weight 300, optional italic product variant (e.g. 'iPad air') at 28px in #2997ff. Two pill buttons below, generous vertical breathing room.

### Footer
**Role:** Site-wide legal and link directory

#f5f5f7 or #1d1d1f background, multi-column link grid at 12px weight 400 in #707070 or #f5f5f7, 1px hairline dividers in #333 or #d2d2d7, fine print at 12px. No card surfaces — flat, typographic, structural.

### Form Input
**Role:** Search, email capture, configuration inputs

8px radius, 1px border in #d2d2d7 or #707070, 14-17px text, #f5f5f7 fill. Focus ring in #0071e3 at 2px.

## Do's and Don'ts

### Do
- Use #0071e3 only for filled action buttons and selected/active states — one color, one job.
- Pair every filled blue button with an outlined blue secondary action, never stack two filled buttons.
- Set body text at 17px with -0.016em letter-spacing — the negative tracking is what makes Apple type feel precise, not the size alone.
- Let product photography fill the full viewport width — never constrain hero images to a max-width container.
- Use 980px border-radius for every interactive button, tag, and pill — the fully rounded shape is non-negotiable.
- Set section backgrounds to full-bleed #f5f5f7 or a single product color wash — never use card containers inside a section.
- Weight 300 for subheads and editorial descriptors creates the signature Apple whisper-voice — 400 is for body, 600 is for nav.

### Don't
- Never use #0071e3 for text, borders, or decoration — it is exclusively a button fill color.
- Never add drop shadows to cards, buttons, or nav — the system uses hairline borders and surface shifts, not elevation.
- Never set headlines at 700 weight for product names — 600 is the maximum; 700 only appears in editorial lockups or promotional art.
- Never use a card or panel inside a #f5f5f7 section — the canvas itself is the surface; containers break the spatial logic.
- Never constrain the main content to a narrow column — Apple pages breathe at 100% width with internal max-widths only for text-heavy blocks.
- Never use radius below 980px for buttons or above 8px for cards/images — these are the only two radius values in the system.
- Never mix the three blues in one interactive element — #0071e3 is fill, #0066cc is outlined action, #2997ff is decorative.

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Canvas | `#f5f5f7` | Page background, section default |
| 1 | Elevated Wash | `#f4f8fb` | Light blue-tinted section background for featured products |
| 2 | Pebble | `#e2e2e5` | Button fills, disabled states, surface differentiation |

## Imagery

Photography is the dominant visual language. Product shots are rendered on pure white or soft gray backgrounds with no environmental context — the device IS the hero, isolated and lit. Lifestyle photography appears in feature banners at full-bleed width, often with subjects cropped tightly. Color washes (pastel blue, pink, green) serve as section backgrounds for product highlights, not as decoration. Iconography is minimal and line-based, weight 1-2px, in the same gray scale as text. No illustrations, no abstract graphics, no 3D renders beyond the product photography itself.

## Layout

Full-bleed page model with no fixed max-width container — sections stretch edge-to-edge while text blocks center internally at roughly 980px. Navigation is a single sticky global bar with a secondary product-specific sub-nav that appears on scroll. Hero pattern is always centered: large product name, one-line tagline, two pill buttons, then the product render filling the remaining viewport. Sections stack vertically with generous vertical rhythm (64px+ between sections), alternating between #f5f5f7 and color-wash backgrounds. The lower page is a single horizontal row of full-bleed service cards (Apple TV+, Fitness+, Music, Arcade), each a photographic tile with overlaid text and a pill action. No sidebars, no multi-column content layouts, no asymmetric compositions — everything is centered, stacked, and symmetrical.

## Agent Prompt Guide

**Quick Color Reference**
- text: #1d1d1f
- background: #f5f5f7
- border: #d2d2d7 / #333333
- accent: #2997ff (decorative only)
- primary action: #0071e3 (filled action)
- outlined action border: #0066cc

**3-5 Example Component Prompts**
1. Create a product hero section: #f5f5f7 full-bleed background. Headline 'iPhone' at 56px SF Pro Display weight 600, #1d1d1f, letter-spacing 0.616px. Tagline 'Meet the latest iPhone lineup.' at 26px SF Pro Text weight 300, #1d1d1f. Two pill buttons centered below: filled #0071e3 with white text 'Learn more' (980px radius, 11px 15px padding), and outlined #0066cc with 1px border and #0066cc text 'Shop iPhone' (same radius and padding). Product render fills the lower portion.

2. Create a service card tile: full-bleed photographic background, 8px radius. Title 'Fitness+' at 28px weight 600 white, genre label at 12px weight 400 white with 70% opacity. Pill button at bottom: 980px radius, #0071e3 background, white text 'Watch now' at 14px weight 400, 8px 15px padding.

3. Create a global nav bar: full-width, #1d1d1f background, 8px vertical padding. Apple logo SVG on left at 14px height. Nav links centered: Store, Mac, iPad, iPhone, Watch, Vision, AirPods, TV & Home, Entertainment, Accessories, Support — all 12px weight 400, #f5f5f7 color, 1px #333333 bottom border on the bar. Search icon and bag icon on right.

4. Create a typographic CTA block: centered, 64px vertical padding. Product name 'iPad' at 40px SF Pro Display weight 600 #1d1d1f, followed by 'air' inline at 28px weight 400 italic #2997ff. Subtitle 'Now supercharged by M4.' at 21px weight 300 #1d1d1f. Two pill buttons below: filled #0071e3 'Learn more' and outlined #0066cc 'Buy' (both 980px radius, 11px 15px padding).

5. Create a footer block: #f5f5f7 background, four-column link grid. Each link 12px weight 400 #707070, 10px vertical gap. Column headers at 12px weight 600 #1d1d1f. 1px #d2d2d7 hairline divider above fine print. Fine print at 12px weight 400 #707070.

## Elevation Philosophy

This system intentionally avoids elevation as a visual tool. Instead of shadows, hierarchy is built through surface color shifts (#f5f5f7 canvas, #f4f8fb elevated wash, #e2e2e5 filled surfaces) and 1px hairline borders in #d2d2d7 or #333333. The only shadow present is a subtle rgba(0,0,0,0.22) 3px 5px 30px on product images to ground them against the white canvas — never on cards, buttons, or panels. Flatness is the signature; depth comes from scale and photography, not from CSS shadows.

## Similar Brands

- **Bang & Olufsen** — Same product-as-hero isolation photography on white canvas, same generous whitespace, same whisper-thin typography for product names
- **Teenage Engineering** — Same near-monochrome product pages with generous spacing, though TE adds more personality through type and color accents
- **Nothing (tech)** — Similar minimal product showcase layout, though Nothing uses more dot-matrix texture and dark surfaces
- **Dyson** — Same centered product hero with large render, minimal copy, and paired pill action buttons on a light gray canvas

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-apple-blue: #0071e3;
  --color-link-blue: #0066cc;
  --color-signal-blue: #2997ff;
  --color-carbon: #1d1d1f;
  --color-frost: #f5f5f7;
  --color-ice: #f4f8fb;
  --color-smoke: #333333;
  --color-graphite: #474747;
  --color-ash: #707070;
  --color-mist: #858585;
  --color-onyx: #000000;
  --color-pebble: #e2e2e5;

  /* Typography — Font Families */
  --font-sf-pro-display: 'SF Pro Display', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-sf-pro-text: 'SF Pro Text', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.33;
  --tracking-caption: -0.264px;
  --text-body-sm: 14px;
  --leading-body-sm: 1.29;
  --tracking-body-sm: -0.224px;
  --text-body: 17px;
  --leading-body: 1.47;
  --tracking-body: -0.272px;
  --text-subheading: 21px;
  --leading-subheading: 1.24;
  --tracking-subheading: -0.105px;
  --text-heading-sm: 28px;
  --leading-heading-sm: 1.18;
  --tracking-heading-sm: 0.196px;
  --text-heading: 40px;
  --leading-heading: 1.14;
  --tracking-heading: 0.44px;
  --text-heading-lg: 44px;
  --leading-heading-lg: 1.18;
  --tracking-heading-lg: -0.44px;
  --text-display: 56px;
  --leading-display: 1.07;
  --tracking-display: 0.616px;

  /* Typography — Weights */
  --font-weight-light: 300;
  --font-weight-regular: 400;
  --font-weight-semibold: 600;
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
  --spacing-48: 48px;
  --spacing-56: 56px;

  /* Layout */
  --page-max-width: 1440px;
  --section-gap: 64px;
  --card-padding: 24px;
  --element-gap: 12px;

  /* Border Radius */
  --radius-lg: 8px;
  --radius-lg-2: 11px;
  --radius-full: 980px;
  --radius-full-2: 999px;

  /* Named Radii */
  --radius-tags: 980px;
  --radius-cards: 8px;
  --radius-images: 8px;
  --radius-inputs: 8px;
  --radius-buttons: 980px;

  /* Shadows */
  --shadow-xl: rgba(0, 0, 0, 0.22) 3px 5px 30px 0px;

  /* Surfaces */
  --surface-canvas: #f5f5f7;
  --surface-elevated-wash: #f4f8fb;
  --surface-pebble: #e2e2e5;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-apple-blue: #0071e3;
  --color-link-blue: #0066cc;
  --color-signal-blue: #2997ff;
  --color-carbon: #1d1d1f;
  --color-frost: #f5f5f7;
  --color-ice: #f4f8fb;
  --color-smoke: #333333;
  --color-graphite: #474747;
  --color-ash: #707070;
  --color-mist: #858585;
  --color-onyx: #000000;
  --color-pebble: #e2e2e5;

  /* Typography */
  --font-sf-pro-display: 'SF Pro Display', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-sf-pro-text: 'SF Pro Text', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.33;
  --tracking-caption: -0.264px;
  --text-body-sm: 14px;
  --leading-body-sm: 1.29;
  --tracking-body-sm: -0.224px;
  --text-body: 17px;
  --leading-body: 1.47;
  --tracking-body: -0.272px;
  --text-subheading: 21px;
  --leading-subheading: 1.24;
  --tracking-subheading: -0.105px;
  --text-heading-sm: 28px;
  --leading-heading-sm: 1.18;
  --tracking-heading-sm: 0.196px;
  --text-heading: 40px;
  --leading-heading: 1.14;
  --tracking-heading: 0.44px;
  --text-heading-lg: 44px;
  --leading-heading-lg: 1.18;
  --tracking-heading-lg: -0.44px;
  --text-display: 56px;
  --leading-display: 1.07;
  --tracking-display: 0.616px;

  /* Spacing */
  --spacing-4: 4px;
  --spacing-8: 8px;
  --spacing-12: 12px;
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-40: 40px;
  --spacing-48: 48px;
  --spacing-56: 56px;

  /* Border Radius */
  --radius-lg: 8px;
  --radius-lg-2: 11px;
  --radius-full: 980px;
  --radius-full-2: 999px;

  /* Shadows */
  --shadow-xl: rgba(0, 0, 0, 0.22) 3px 5px 30px 0px;
}
```
