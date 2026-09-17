# Fluz — Style Reference
> Gemstone vault on warm parchment

**Theme:** light

Fluz runs a warm, opulent financial interface built on a single near-black brand color (#1a0000) that replaces pure black with a hint of cocoa, making the dense condensed display typography feel rich rather than clinical. The hero is maximalist — a full-bleed prismatic gradient (sky blue → lavender → mint → emerald) behind a Greed Condensed headline scaled to 96–203px, floating with 3D gems and butterflies — while every other section stays quiet, white, and typographically disciplined. Buttons are aggressively pill-shaped (200px radius) in the warm-black fill, creating a tactile, almost candy-like contrast against the minimal product card grid. The system deliberately oscillates between two registers: a one-screen burst of playful abundance, and a long, cream-toned product showcase that trusts tight tracking and condensed display type to carry the brand.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Espresso Ink | `#1a0000` | `--color-espresso-ink` | Primary text, filled CTA buttons, top navigation bar, icon strokes — warm near-black replaces pure #000 to feel like ground cocoa rather than ink |
| Prism Spectrum | `linear-gradient(90deg, rgb(130, 190, 255), rgb(166, 180, 247) 47.21%, rgb(91, 184, 154) 73.75%, rgb(33, 186, 76) 91.26%)` | `--color-prism-spectrum` | Hero background gradient — sky blue to lavender to mint to emerald, used as a one-screen burst of color at the top of the page only |
| Canvas White | `#ffffff` | `--color-canvas-white` | Page background, product card surfaces, button text on dark fills |
| Linen Mist | `#f2f2f2` | `--color-linen-mist` | Secondary card surface, alternating section background, subtle depth against pure white |
| Bone | `#ededec` | `--color-bone` | Hairline borders, dividers, icon strokes, subtle surface elevation — the warm-tinted neutral that holds the system together |
| Taupe Slate | `#514f4c` | `--color-taupe-slate` | Secondary body text, card borders, muted labels — warm gray that pairs with Espresso Ink without going cold |
| Ash Gray | `#aeaea6` | `--color-ash-gray` | Helper text, tertiary metadata, low-emphasis borders |
| Charcoal Bronze | `#3a3a3a` | `--color-charcoal-bronze` | Badge backgrounds, dark overlay surfaces, secondary dark elements |
| Obsidian Roast | `#221919` | `--color-obsidian-roast` | Deep section backgrounds, dark overlay panels — warmer and richer than #000 |
| Iris Blue | `#98bbf4` | `--color-iris-blue` | Accent card surface, decorative highlight wash on product cards — echoes the hero gradient's blue end |

## Tokens — Typography

### Greed-SemiBold — Greed-SemiBold — detected in extracted data but not described by AI · `--font-greed-semibold`
- **Weights:** 400, 700
- **Sizes:** 11px, 14px
- **Line height:** 1.27, 1.29
- **Role:** Greed-SemiBold — detected in extracted data but not described by AI

### Greed Condensed — Display and headings — the signature condensed face. Hero headlines stretch to 96–203px with ultra-tight tracking (-0.025em) and compressed line-heights (0.79) that let the massive letters stack vertically. This is the brand's typographic exclamation point. · `--font-greed-condensed`
- **Substitute:** Bebas Neue, Oswald, Anton
- **Weights:** 700
- **Sizes:** 32px, 42px, 54px, 64px, 96px, 203px
- **Line height:** 0.79–1.33
- **Letter spacing:** -0.005em to -0.030em, tightening as size increases
- **Role:** Display and headings — the signature condensed face. Hero headlines stretch to 96–203px with ultra-tight tracking (-0.025em) and compressed line-heights (0.79) that let the massive letters stack vertically. This is the brand's typographic exclamation point.

### Area — Body text, UI labels, button text, links, badges. A geometric sans with generous x-height and normal tracking — the steady workhorse that keeps the interface readable below the display headlines. · `--font-area`
- **Substitute:** Inter, Söhne, General Sans
- **Weights:** 400, 700
- **Sizes:** 14px, 16px, 17px, 20px
- **Line height:** 1.40–1.50
- **Role:** Body text, UI labels, button text, links, badges. A geometric sans with generous x-height and normal tracking — the steady workhorse that keeps the interface readable below the display headlines.

### Greed Condensed — Subheading tier — same condensed family at reduced weight and size for section titles that need display character without hero scale · `--font-greed-condensed`
- **Substitute:** Oswald, Barlow Condensed
- **Weights:** 400
- **Sizes:** 16px, 24px
- **Line height:** 1.17–1.50
- **Role:** Subheading tier — same condensed family at reduced weight and size for section titles that need display character without hero scale

### Arial — Arial — detected in extracted data but not described by AI · `--font-arial`
- **Weights:** 400
- **Sizes:** 13px
- **Line height:** 1.2
- **Role:** Arial — detected in extracted data but not described by AI

### Greed SemiBold — Greed SemiBold — detected in extracted data but not described by AI · `--font-greed-semibold`
- **Weights:** 600, 700
- **Sizes:** 15px, 54px
- **Line height:** 0.92, 1.6
- **Letter spacing:** -0.03
- **Role:** Greed SemiBold — detected in extracted data but not described by AI

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 11px | 1.27 | — | `--text-caption` |
| body-sm | 14px | 1.29 | — | `--text-body-sm` |
| body | 16px | 1.5 | — | `--text-body` |
| subheading | 24px | 1.25 | -0.38px | `--text-subheading` |
| heading-sm | 42px | 1.2 | -0.84px | `--text-heading-sm` |
| heading | 64px | 1.15 | -1.22px | `--text-heading` |
| heading-lg | 96px | 1 | -2.4px | `--text-heading-lg` |
| display | 203px | 0.79 | -5.08px | `--text-display` |

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
| 36 | 36px | `--spacing-36` |
| 40 | 40px | `--spacing-40` |
| 48 | 48px | `--spacing-48` |
| 56 | 56px | `--spacing-56` |
| 96 | 96px | `--spacing-96` |
| 140 | 140px | `--spacing-140` |
| 192 | 192px | `--spacing-192` |

### Border Radius

| Element | Value |
|---------|-------|
| cards | 20px |
| links | 100px |
| badges | 100px |
| inputs | 100px |
| buttons | 200px |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 64px
- **Card padding:** 20px
- **Element gap:** 8px

## Components

### Pill CTA Button (Filled)
**Role:** Primary action — the 'Sign up' and 'Log in' buttons

Background #1a0000 (Espresso Ink), text #ffffff in Area Semibold 16px, padding 10px 16px, border-radius 200px (fully pill-shaped). No border, no shadow. The dark fill against light surfaces is the only button weight needed.

### Pill Ghost Button
**Role:** Secondary action, nav controls (Search)

Transparent background, border 1px solid #ffffff or #ededec, text #ffffff or #1a0000, Area 16px, border-radius 100px. Used for the search button in the dark nav bar.

### Top Navigation Bar
**Role:** Global header — sticky, full-bleed

Background #1a0000, height ~56px, flex row with logo left, nav links center (Area 16px weight 400, #ffffff), search + CTA right. A second utility row above contains 'Money / Marketplace / Blog' links in smaller Area. The black bar is the visual anchor — everything below it is light.

### Product Showcase Card
**Role:** Feature card displaying a product screenshot or photograph

Background #ffffff or #f2f2f2, border-radius 20px, no visible border or shadow. Contains a full-bleed image (hand holding phone, burger, app screen) with 20px corner clipping. Cards sit in a horizontal scroll or 3-column grid with comfortable gaps.

### Category Feature Card
**Role:** Product pillar card (Personal / Business / Platform)

Background #f2f2f2, border-radius 20px, padding 20px. Category label in Greed Condensed SemiBold 24px, #1a0000. Description in Area 16px, #514f4c. Product image or 3D render at the bottom. No shadow — the warm gray fill is the only elevation.

### Hero Gradient Section
**Role:** Full-bleed opening banner — the one place color explodes

Background: linear-gradient(90deg, rgb(130,190,255) → rgb(166,180,247) 47% → rgb(91,184,154) 74% → rgb(33,186,76) 91%). Centered Greed Condensed SemiBold 203px display headline in #ffffff with 3D decorative elements (gems, butterflies) floating around. Subtext in Area 16–18px, #ffffff at 80% opacity. The single pill CTA below.

### Display Headline
**Role:** Hero and section H1

Greed Condensed SemiBold 700, sizes ranging 64–203px, line-height 0.79–1.15, letter-spacing -0.019em to -0.030em. Color: #1a0000 on light surfaces, #ffffff on dark or gradient surfaces. The compressed line-height lets multi-line headlines stack tight.

### Badge / Pill Tag
**Role:** Category labels, status indicators

Background #3a3a3a or #ededec, text #ffffff or #1a0000, Area Semibold 11–14px, border-radius 100px, padding 2px 10px. Small, compact, never decorative — functional punctuation only.

### Image Mask Card
**Role:** Cards containing organic or photographic imagery

Border-radius 20px on the container, image fills the card edge-to-edge. No border, no shadow — the image's own color and content provide visual weight. Used for the 3-card product showcase row.

### Dark Overlay Panel
**Role:** Full-bleed dark section for dramatic contrast

Background #221919 or #1a0000, content in #ffffff and #ededec. Used sparingly — one or two per page maximum — to break the white rhythm. Text uses Greed Condensed for headings and Area for body, maintaining the type system.

### Footer Link Block
**Role:** Footer navigation column

Area 14px weight 400, #514f4c, line-height 1.6. Column headings in Area Semibold 14px, #1a0000. No icons, no dividers — just generous spacing between link items.

### Search Button (Nav)
**Role:** Global search trigger in navigation

Ghost pill on the dark nav bar: transparent background, border 1px solid #ededec, text + icon in #ffffff, border-radius 100px, padding 8px 16px.

## Do's and Don'ts

### Do
- Use Greed Condensed 700 for all display and heading text; use Area 400/700 for everything below heading level — never mix the two in the same role.
- Use #1a0000 (Espresso Ink) for all primary text, filled buttons, and the nav bar — never substitute #000000 or #111111.
- Set border-radius to 200px on filled CTA buttons and 100px on ghost buttons, badges, and inputs — pill shapes are non-negotiable.
- Use the hero gradient (blue → lavender → mint → green) only in the first-screen hero section; treat it as a one-time brand burst, not a repeating background.
- Tighten letter-spacing on Greed Condensed as size increases: -0.005em at 32px up to -0.030em at 203px — the tracking compresses proportionally with scale.
- Set card border-radius to 20px and use no visible border or shadow — let the #f2f2f2 fill or the image content provide the visual weight.
- Keep line-height at 0.79–1.15 on Greed Condensed display sizes — the tight leading is what makes 96px+ headlines feel sculptural rather than loose.

### Don't
- Don't use pure #000000 or #ffffff borders for emphasis — the system's warmth comes from #1a0000 and #ededec.
- Don't apply the prism gradient to cards, buttons, or section backgrounds — it belongs only in the hero.
- Don't use shadow-based elevation on cards; the system uses surface color shifts (#ffffff → #f2f2f2 → #ededec) instead of box-shadows.
- Don't set Greed Condensed to weight 400 at display sizes — it looks anemic; reserve 700 for headings and use Area for body weight contrast.
- Don't break the pill convention with rectangular or rounded-rect buttons (4–8px radius) — the system is fully pill or fully card.
- Don't introduce additional brand colors (purple, orange, pink) — the palette is warm-black, white, warm grays, and the four-stop prism gradient only.
- Don't center-align body text; reserve center alignment for hero headlines and single-line CTAs. Body copy and descriptions stay left-aligned.

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Canvas | `#ffffff` | Primary page background |
| 1 | Linen Card | `#f2f2f2` | Secondary card surface, subtle section differentiation |
| 2 | Bone Edge | `#ededec` | Hairline borders, tertiary surface for nested elements |
| 3 | Iris Wash | `#98bbf4` | Accent card surface echoing the hero gradient |
| 4 | Dark Overlay | `#221919` | Full-bleed dark sections, nav bar, dramatic contrast breaks |

## Elevation

This system deliberately avoids box-shadows. Elevation is communicated through surface color layering (#ffffff → #f2f2f2 → #ededec) and border contrast (hairline #ededec borders on #f2f2f2 cards). The dark nav bar (#1a0000) and hero gradient provide the only dramatic contrast breaks; the rest of the interface stays flat and weightless.

## Imagery

Imagery is split into two distinct registers. The hero uses 3D-rendered decorative objects — translucent iridescent gems, metallic butterflies, floating crystals — that suggest abundance and optimism, placed against the prismatic gradient. Below the hero, imagery shifts to grounded product photography: a hand holding a phone displaying the Fluz app, a burger held in two hands, a close-cropped credit card, app transaction screens. These product shots are full-bleed within 20px-radius card masks, never with lifestyle context or human faces — the object is the hero. Icon style is simple monoline strokes in #1a0000 or #ffffff, consistent with the warm-black palette.

## Layout

Max-width 1200px centered container with comfortable 64px section gaps. The hero is full-bleed (edge-to-edge gradient) with centered text, breaking the container constraint once. Below the hero, a horizontal card scroll or 3-column grid showcases products at full-bleed within 20px-radius masks. Feature sections use a 3-column card grid on white with 20–24px gaps. Navigation is a two-tier sticky black bar (utility links above, brand + nav + CTAs below). Content rhythm alternates between white (#ffffff) and warm gray (#f2f2f2) section backgrounds, with occasional dark (#1a0000) or gradient breaks. The overall density is comfortable — generous vertical breathing room, no information-dense blocks.

## Agent Prompt Guide

## Quick Color Reference
- Primary text: #1a0000 (Espresso Ink)
- Background: #ffffff
- Secondary surface: #f2f2f2 (Linen Mist)
- Border: #ededec (Bone)
- Accent: #98bbf4 (Iris Blue)
- primary action: #1a0000 (filled action)
- Hero gradient: linear-gradient(90deg, #82beff, #a6b4f7 47%, #5bb89a 74%, #21ba4c 91%)

## Example Component Prompts
1. **Hero Section**: Full-bleed background linear-gradient(90deg, #82beff, #a6b4f7 47%, #5bb89a 74%, #21ba4c 91%). Centered headline in Greed Condensed 700, 96–203px, #ffffff, letter-spacing -0.025em, line-height 0.85. Subtext in Area 16px, #ffffff at 80% opacity. Single filled pill CTA below: #1a0000 background, #ffffff text in Area Semibold 16px, padding 10px 16px, border-radius 200px.

2. **Product Card**: Background #ffffff, border-radius 20px, no border, no shadow. Full-bleed image inside the 20px mask. Padding 0 — image fills to edges. If text label needed: Greed Condensed 700, 24px, #1a0000.

3. **Category Feature Card**: Background #f2f2f2, border-radius 20px, padding 20px. Category title in Greed Condensed 700, 24px, #1a0000. Description in Area 400, 16px, #514f4c. Product render or screenshot at bottom, full-width within card.

4. **Pill Ghost Button**: Transparent background, border 1px solid #ededec, text #ffffff or #1a0000 in Area 16px, border-radius 100px, padding 8px 16px. Used for search and secondary nav actions.

5. **Section Heading Block**: Max-width 1200px centered. H2 in Greed Condensed 700, 64px, #1a0000, line-height 1.15, letter-spacing -0.019em. Subtext in Area 400, 18px, #514f4c, max-width 640px.

## Similar Brands

- **Klarna** — Same pill-button CTA system and warm-dark brand color (Klarna's near-black pink undertones mirror Fluz's Espresso Ink) with playful product imagery in rounded cards
- **Cash App** — Bold condensed display typography in fintech, with a single dominant brand color against white surfaces and a willingness to let one section be visually loud while the rest stays minimal
- **Wise** — Warm-toned financial brand that uses #1a0000-like warm near-blacks instead of pure #000, paired with generous white space and tight typographic hierarchy
- **Mercury** — Clean cream-and-warm-gray surface stack with pill-shaped buttons and a disciplined two-font system (display + body sans)
- **Robinhood** — Aggressive condensed display type in a financial context, with a single accent color burst (Robinhood green / Fluz prism gradient) breaking an otherwise monochrome interface

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-espresso-ink: #1a0000;
  --color-prism-spectrum: #a6b4f7;
  --gradient-prism-spectrum: linear-gradient(90deg, rgb(130, 190, 255), rgb(166, 180, 247) 47.21%, rgb(91, 184, 154) 73.75%, rgb(33, 186, 76) 91.26%);
  --color-canvas-white: #ffffff;
  --color-linen-mist: #f2f2f2;
  --color-bone: #ededec;
  --color-taupe-slate: #514f4c;
  --color-ash-gray: #aeaea6;
  --color-charcoal-bronze: #3a3a3a;
  --color-obsidian-roast: #221919;
  --color-iris-blue: #98bbf4;

  /* Typography — Font Families */
  --font-greed-semibold: 'Greed-SemiBold', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-greed-condensed: 'Greed Condensed', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-area: 'Area', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-arial: 'Arial', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 11px;
  --leading-caption: 1.27;
  --text-body-sm: 14px;
  --leading-body-sm: 1.29;
  --text-body: 16px;
  --leading-body: 1.5;
  --text-subheading: 24px;
  --leading-subheading: 1.25;
  --tracking-subheading: -0.38px;
  --text-heading-sm: 42px;
  --leading-heading-sm: 1.2;
  --tracking-heading-sm: -0.84px;
  --text-heading: 64px;
  --leading-heading: 1.15;
  --tracking-heading: -1.22px;
  --text-heading-lg: 96px;
  --leading-heading-lg: 1;
  --tracking-heading-lg: -2.4px;
  --text-display: 203px;
  --leading-display: 0.79;
  --tracking-display: -5.08px;

  /* Typography — Weights */
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
  --spacing-28: 28px;
  --spacing-32: 32px;
  --spacing-36: 36px;
  --spacing-40: 40px;
  --spacing-48: 48px;
  --spacing-56: 56px;
  --spacing-96: 96px;
  --spacing-140: 140px;
  --spacing-192: 192px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 64px;
  --card-padding: 20px;
  --element-gap: 8px;

  /* Border Radius */
  --radius-xl: 15px;
  --radius-2xl: 20px;
  --radius-3xl: 24px;
  --radius-3xl-2: 40px;
  --radius-full: 100px;
  --radius-full-2: 200px;
  --radius-full-3: 500px;

  /* Named Radii */
  --radius-cards: 20px;
  --radius-links: 100px;
  --radius-badges: 100px;
  --radius-inputs: 100px;
  --radius-buttons: 200px;

  /* Surfaces */
  --surface-canvas: #ffffff;
  --surface-linen-card: #f2f2f2;
  --surface-bone-edge: #ededec;
  --surface-iris-wash: #98bbf4;
  --surface-dark-overlay: #221919;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-espresso-ink: #1a0000;
  --color-prism-spectrum: #a6b4f7;
  --color-canvas-white: #ffffff;
  --color-linen-mist: #f2f2f2;
  --color-bone: #ededec;
  --color-taupe-slate: #514f4c;
  --color-ash-gray: #aeaea6;
  --color-charcoal-bronze: #3a3a3a;
  --color-obsidian-roast: #221919;
  --color-iris-blue: #98bbf4;

  /* Typography */
  --font-greed-semibold: 'Greed-SemiBold', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-greed-condensed: 'Greed Condensed', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-area: 'Area', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-arial: 'Arial', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 11px;
  --leading-caption: 1.27;
  --text-body-sm: 14px;
  --leading-body-sm: 1.29;
  --text-body: 16px;
  --leading-body: 1.5;
  --text-subheading: 24px;
  --leading-subheading: 1.25;
  --tracking-subheading: -0.38px;
  --text-heading-sm: 42px;
  --leading-heading-sm: 1.2;
  --tracking-heading-sm: -0.84px;
  --text-heading: 64px;
  --leading-heading: 1.15;
  --tracking-heading: -1.22px;
  --text-heading-lg: 96px;
  --leading-heading-lg: 1;
  --tracking-heading-lg: -2.4px;
  --text-display: 203px;
  --leading-display: 0.79;
  --tracking-display: -5.08px;

  /* Spacing */
  --spacing-4: 4px;
  --spacing-8: 8px;
  --spacing-12: 12px;
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-28: 28px;
  --spacing-32: 32px;
  --spacing-36: 36px;
  --spacing-40: 40px;
  --spacing-48: 48px;
  --spacing-56: 56px;
  --spacing-96: 96px;
  --spacing-140: 140px;
  --spacing-192: 192px;

  /* Border Radius */
  --radius-xl: 15px;
  --radius-2xl: 20px;
  --radius-3xl: 24px;
  --radius-3xl-2: 40px;
  --radius-full: 100px;
  --radius-full-2: 200px;
  --radius-full-3: 500px;
}
```
