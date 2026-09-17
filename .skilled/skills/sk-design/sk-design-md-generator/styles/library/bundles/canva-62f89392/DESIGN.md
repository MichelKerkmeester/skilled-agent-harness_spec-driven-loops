# Canva — Style Reference
> candy-colored creative studio — a white canvas floating inside a gradient sky

**Theme:** light

Canva's design system is a candy-colored creative studio: a canvas that breathes, floats, and splashes through saturated gradient skies. The interface alternates between pure white workspace moments and full-bleed chromatic panels that serve as the real product showcase — teal-to-violet, magenta-to-coral, emerald-to-lime — each one a mood rather than a decorative fill. Typography is a custom humanist sans (Canva Sans) that stays warm and friendly at every weight; display sizes stretch to 80px with whisper-tight tracking, while body text sits at 16–18px in a comfortable 1.4–1.5 line height. Surfaces are flat with subtle 8px rounding and barely-there blue-tinted shadows; elevation is implied through color and gradient rather than depth. The wordmark is a hand-cut italic script, the only curved-letterform in the system, acting as a signature stamp on the otherwise geometric UI.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Canva Violet | `#8b3dff` | `--color-canva-violet` | Primary brand color, gradient anchor, link text, category icon accents |
| Soft Iris | `#a370fc` | `--color-soft-iris` | Secondary violet for lighter gradient stops, subdued link states, decorative icon tints |
| Deep Amethyst | `#9729ff` | `--color-deep-amethyst` | Violet supporting accent for decorative details and low-frequency emphasis. Do not promote it to the primary CTA color |
| Ember Red | `#ff3d4d` | `--color-ember-red` | Warm accent for gradient panels, social/heart icon variants, category tag punctuation |
| Plasma Pink | `#e950f7` | `--color-plasma-pink` | Magenta accent for gradient sweeps, sparkle/sticker icon variants, creative expression |
| Solar Orange | `#ff6105` | `--color-solar-orange` | Orange accent for warm gradient panels, fire/print icon variants, callout energy |
| Ink Black | `#0f1015` | `--color-ink-black` | Primary text, dark surface fills, button text on light backgrounds, nav text |
| Pure Black | `#000000` | `--color-pure-black` | Hardest text, logo wordmark rendering, high-contrast icons |
| Off-Black | `#231f20` | `--color-off-black` | Print-style black for rich type rendering, secondary deep fill |
| Slate Smoke | `#575a5f` | `--color-slate-smoke` | Muted helper text, secondary nav, icon outlines, inactive state text |
| Pale Mist | `#d7d9de` | `--color-pale-mist` | Hairline borders, focus ring halos, very-light dividers, subtle shadow tints |
| Paper White | `#ffffff` | `--color-paper-white` | Light supporting surface for subtle backgrounds and section separation. Do not promote it to the primary CTA color |
| Teal Violet Sky | `linear-gradient(135deg, rgb(0, 196, 204), rgb(125, 42, 232))` | `--color-teal-violet-sky` | Hero and feature card gradient — teal to violet sweep at 135deg |
| Coral Sunset | `linear-gradient(rgb(255, 59, 76) 5.8%, rgb(255, 98, 18) 32.1%, rgb(255, 205, 179) 100%)` | `--color-coral-sunset` | Warm-to-peach gradient panel for lifestyle/print product cards |
| Emerald Meadow | `linear-gradient(rgb(0, 125, 38) 0%, rgb(0, 177, 0) 60%, rgb(225, 255, 192) 83%)` | `--color-emerald-meadow` | Green gradient panel for app-integration and template discovery cards |
| Ulraviolet Horizon | `linear-gradient(rgb(153, 43, 255), rgb(90, 50, 250) 30.09%, rgb(19, 163, 181) 56.76%, rgb(147, 232, 246) 76.85%, rgb(241, 235, 255) 95.28%, rgb(255, 255, 255))` | `--color-ulraviolet-horizon` | Wide spectrum hero gradient — purple to cyan to white wash, the most expansive expression of the brand |

## Tokens — Typography

### Times — Times — detected in extracted data but not described by AI · `--font-times`
- **Weights:** 400
- **Sizes:** 10px
- **Line height:** 1.2
- **Role:** Times — detected in extracted data but not described by AI

### Canva Sans — Sole brand typeface — humanist sans with warm apertures, used for everything from 14px body to 80px display. Weight 400 is the workhorse; 500 carries subheads; 600 punches buttons and tag labels. The ss02/ss03 stylistic sets give alternative letterforms that add personality without going decorative. · `--font-canva-sans`
- **Substitute:** Inter, DM Sans, or Plus Jakarta Sans
- **Weights:** 400, 500, 600
- **Sizes:** 14, 16, 18, 24, 28, 32, 36, 56, 64, 80
- **Line height:** 1.10, 1.25, 1.33, 1.38, 1.40, 1.50, 1.57
- **Letter spacing:** -0.0100em at 14–80px
- **OpenType features:** `"ss02" on, "ss03" on`
- **Role:** Sole brand typeface — humanist sans with warm apertures, used for everything from 14px body to 80px display. Weight 400 is the workhorse; 500 carries subheads; 600 punches buttons and tag labels. The ss02/ss03 stylistic sets give alternative letterforms that add personality without going decorative.

### Arial — Arial — detected in extracted data but not described by AI · `--font-arial`
- **Weights:** 400
- **Sizes:** 13px
- **Line height:** 1.2
- **Role:** Arial — detected in extracted data but not described by AI

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 14px | 1.38 | -0.14px | `--text-caption` |
| body | 16px | 1.5 | -0.16px | `--text-body` |
| body-lg | 18px | 1.57 | -0.18px | `--text-body-lg` |
| subheading | 24px | 1.4 | -0.24px | `--text-subheading` |
| heading-sm | 28px | 1.33 | -0.28px | `--text-heading-sm` |
| heading | 32px | 1.25 | -0.32px | `--text-heading` |
| heading-lg | 36px | 1.25 | -0.36px | `--text-heading-lg` |
| display | 56px | 1.1 | -0.56px | `--text-display` |
| hero | 64px | 1.1 | -0.64px | `--text-hero` |
| mega | 80px | 1.1 | -0.8px | `--text-mega` |

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
| 44 | 44px | `--spacing-44` |
| 48 | 48px | `--spacing-48` |
| 76 | 76px | `--spacing-76` |
| 212 | 212px | `--spacing-212` |

### Border Radius

| Element | Value |
|---------|-------|
| cards | 8px |
| icons | 8px |
| pills | 9999px |
| buttons | 8px |
| featurePanels | 16px |

### Shadows

| Name | Value | Token |
|------|-------|-------|
| subtle | `rgba(64, 79, 109, 0.06) 0px 0px 0px 0.5px, rgba(24, 44, 8...` | `--shadow-subtle` |
| subtle-2 | `rgba(53, 65, 90, 0.2) 0px 0px 0px 1px inset` | `--shadow-subtle-2` |
| subtle-3 | `rgba(255, 255, 255, 0.2) 0px 0px 0px 1px inset` | `--shadow-subtle-3` |

### Layout

- **Page max-width:** 1280px
- **Section gap:** 64px
- **Card padding:** 24px
- **Element gap:** 12px

## Components

### Primary White Button
**Role:** Main call-to-action on gradient backgrounds

White fill (#ffffff), Ink Black text (#0f1015), Canva Sans 16px weight 500, 8px radius, 12px vertical / 20px horizontal padding, subtle 1px inset border in rgba(53,65,90,0.2) for edge definition on bright backgrounds.

### Dark Inverse Button
**Role:** Primary action on white sections

Ink Black fill (#0f1015), white text, 8px radius, 12px/20px padding, white 1px inset highlight ring. Weight 500 at 16px.

### Ghost Outline Button
**Role:** Secondary action, navigation edges

Transparent fill, 1px border in Ink Black or white depending on context, 8px radius, 12px/16px padding, weight 500 text.

### Pill Navigation Link
**Role:** Top nav menu items, category tabs

9999px radius, transparent fill, Canva Sans 14–16px weight 500, Ink Black text, 8px horizontal padding. Active state gets a subtle background tint or underline.

### Gradient Feature Card
**Role:** Primary content card for product features and category showcases

16px radius, full-bleed gradient background (teal-to-violet, coral-sunset, emerald-meadow, or ultraviolet-horizon), 24–32px internal padding, white text, headline at 24–32px weight 500, body at 16px weight 400, optional white ghost button. Cards cast the standard blue-tinted shadow.

### White Product Card
**Role:** Template grid items, product cards on white sections

8px radius, white fill (#ffffff), 24px padding, 0.5px hairline border in Pale Mist (#d7d9de), standard blue-tinted shadow stack. Interior uses Ink Black text and may include small colored icon accents.

### Category Chip with Icon
**Role:** Scrollable category navigation (New launches, AI, Social, Video, etc.)

White fill or transparent, 8px radius, 8–12px padding, 14px weight 500 text, paired with a small 16–20px icon rendered in a brand accent color (violet, pink, orange). Sits inside a scrollable horizontal strip with 12px gaps.

### Search Bar
**Role:** Top-level global search

White fill or translucent, 9999px radius, 12–16px padding, 16px weight 400 text, with a search icon in Slate Smoke (#575a5f). Placeholder text in Slate Smoke.

### Wordmark / Logo Lockup
**Role:** Brand identifier in header and footer

Custom italic script rendering of "Canva" in white on dark/gradient contexts, or Ink Black on white. Unique curved letterforms that contrast with the geometric Canva Sans system.

### Header Navigation Bar
**Role:** Top-of-page persistent navigation

Transparent on the gradient hero, white when scrolled. Contains logo left, centered nav links (Design, Product, Plans, Business, Education, Help) as pill links, and Sign up + Log in buttons right. Sits at 64–72px height with 16–24px horizontal padding.

### Gradient Hero Section
**Role:** Above-the-fold brand statement

Full-bleed Teal Violet Sky gradient (135deg), 600–700px height, centered headline at 56–64px white weight 400, subtitle at 18px white with 80% opacity, white CTA button centered, and a constellation of floating 3D design-tool icons below.

### Floating Design Tool Icon
**Role:** Decorative product affordance in hero

Small 48–64px glass-morphism tile (white with 40% opacity or colored gradient), 8px radius, containing a typographic or graphic symbol. Arranged in a scattered constellation to imply creative possibility.

### Section Heading
**Role:** Section-level title block

Canva Sans 36–56px weight 400, Ink Black, centered or left-aligned, with optional descriptive subtitle at 18px weight 400 in Slate Smoke. Sits above card grids with 40–64px gap below.

### Ghost Card Link Button
**Role:** "Explore" / "Learn more" inside gradient cards

White fill, Ink Black text, 8px radius, 8–12px padding, 14px weight 500. Sits in the top-left or bottom-left of a gradient feature card.

## Do's and Don'ts

### Do
- Use full-bleed gradient panels as the chromatic stage for product features — let teal-to-violet, coral-sunset, emerald-meadow, and ultraviolet-horizon carry the visual weight, not small icon accents.
- Set all body text in Canva Sans weight 400 at 16–18px with line-height 1.5–1.57; Canva's tone is conversational, not compressed.
- Anchor every primary action with a solid white or solid Ink Black button at 8px radius, 12px/20px padding, weight 500 — never use a chromatic fill for the main CTA when it competes with gradient panels.
- Apply 8px radius as the default for all cards, buttons, and chips; reserve 16px for full-bleed gradient feature panels and 9999px for pills and search fields.
- Maintain a single -0.0100em letter-spacing across the Canva Sans scale; let the typeface's humanist warmth do the work without aggressive tracking tweaks.
- Build section rhythm as white-space → gradient-panel → white-space, with 64px section gaps; the alternation is the page's signature.
- Pair the Canva Sans geometric forms with the custom italic script wordmark for logo lockups; the script's curves are the only deviation from the system's straight geometry.

### Don't
- Don't use chromatic fills for the main CTA button — white or Ink Black only, so it never fights the gradient panels.
- Don't apply heavy drop shadows; Canva's elevation is whisper-light, with blue-tinted stacks at rgba(24,44,89,0.07–0.14) and 0.5px hairline borders.
- Don't use Canva Sans at weight 700 or above; the system maxes out at 600, and most display headlines sit at weight 400 for warmth.
- Don't introduce new chromatic accent hues — stick to the brand palette: Canva Violet, Deep Amethyst, Ember Red, Plasma Pink, Solar Orange.
- Don't compress line-height below 1.25 even for display sizes; the humanist proportions need air.
- Don't use sharp 0px radius on rectangular elements; the system is consistently rounded, and 8px is the floor.
- Don't replace Canva Sans with Times or Arial — those are fallback scaffolding for image-rendered text inside template thumbnails, not page UI.

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Paper White | `#ffffff` | Base page canvas, negative space, breathing room between gradient sections |
| 1 | White Card | `#ffffff` | Feature card surfaces on white page, category pill backgrounds |
| 2 | Gradient Panel | `#7d2ae8` | Full-bleed feature card backgrounds, hero zone — the chromatic stage where the product lives |

## Elevation

- **Feature card / product tile:** `rgba(64, 79, 109, 0.06) 0px 0px 0px 0.5px, rgba(24, 44, 89, 0.137) 0px 2px 4px 0px, rgba(24, 44, 89, 0.07) 0px 6px 12px 0px`
- **Primary button (light variant):** `rgba(53, 65, 90, 0.2) 0px 0px 0px 1px inset`
- **Primary button (dark variant):** `rgba(255, 255, 255, 0.2) 0px 0px 0px 1px inset`

## Imagery

Imagery lives in two modes. The first is product-showcase photography and user-generated content embedded inside gradient feature cards — lifestyle shots of people using printed products, template previews showing Disney characters, app integration logos rendered as colorful tiles. The second is 3D-rendered design tool icons: small glass-morphism cubes containing typographic letters (T for text, C for circle, </> for code), emoji-style sticker icons (heart, sparkle, smile), and colored gradient orbs. These float in a scattered constellation in the hero and serve as the visual proxy for 'every creative tool you can imagine.' Photography is high-key, warm, and staged rather than candid; product crops are tight with no lifestyle context. Icon style is rounded, colorful, and 3D-shaded — they read as playful physical objects rather than flat UI glyphs.

## Layout

Page model is centered with a max-width of 1280px for content blocks, but full-bleed gradient sections break out of the container to span the entire viewport. The hero is a full-bleed gradient with a centered headline over a teal-to-violet wash, followed by a floating icon constellation. Below the hero, sections alternate between white-space and full-bleed gradient feature cards in a 2-column asymmetric grid — one large card on the left, a smaller stacked pair on the right, or balanced equal halves. Content arrangement uses centered headline stacks followed by horizontal card carousels, not alternating text-left/image-right. The category navigation strip is a horizontal scrolling pill bar that sits above the feature card grid. Section gaps are generous (64px), creating a spacious, gallery-like rhythm rather than a dense information layout. Navigation is a thin transparent top bar that becomes white on scroll, with centered pill links and right-aligned action buttons.

## Agent Prompt Guide

**Quick Color Reference**
- text: #0f1015
- background: #ffffff
- border: #d7d9de
- accent: #8b3dff
- primary action: no distinct CTA color
- gradient: linear-gradient(135deg, rgb(0,196,204), rgb(125,42,232))

**Example Component Prompts**

1. **Gradient Feature Card**: Full-bleed background with linear-gradient(135deg, rgb(0,196,204), rgb(125,42,232)). 16px border-radius. 24px padding. White headline at 24px Canva Sans weight 500, letter-spacing -0.24px. White body text at 16px weight 400. White ghost button (white fill, #0f1015 text) at top-left, 8px radius, 12px/16px padding.

2. **White Product Card**: White fill (#ffffff). 8px border-radius. 24px padding. Hairline border: 0.5px solid #d7d9de. Shadow: rgba(64,79,109,0.06) 0px 0px 0px 0.5px, rgba(24,44,89,0.137) 0px 2px 4px, rgba(24,44,89,0.07) 0px 6px 12px. Image area on top, 16px gap, then 16px Canva Sans weight 500 title in #0f1015.

3. **Hero Section**: Full-bleed gradient background linear-gradient(135deg, rgb(0,196,204), rgb(125,42,232)). Centered white headline at 64px Canva Sans weight 400, letter-spacing -0.64px. Subtitle at 18px weight 400 white. White button (fill #ffffff, text #0f1015, 8px radius, 12px/20px padding, 16px weight 500). 64px gap to floating icon constellation.

4. **Top Nav Bar**: Transparent on hero, white when scrolled. 72px height. Left: italic script wordmark. Center: pill nav links (Design, Product, Plans, Business, Education, Help) at 14px Canva Sans weight 500 in #0f1015, 9999px radius, 8px/12px padding. Right: Sign up ghost outline button and Log in dark button (#0f1015 fill, white text, 8px radius).

5. **Category Chip Row**: Horizontal scrollable strip. Chips: 8px radius, white or transparent fill, 8px/12px padding. Each chip pairs a 16px colored icon (violet #8b3dff, pink #e950f7, orange #ff6105) with 14px Canva Sans weight 500 text in #0f1015. 12px gap between chips. White background section.

## Gradient System

Gradients are the real product palette. Six named gradients form a spectrum from cool to warm to natural:
- **Teal Violet Sky** (135deg, teal → violet) — the default hero and product feature card
- **Coral Sunset** (vertical, red → orange → peach) — lifestyle, print, commerce cards
- **Emerald Meadow** (vertical, deep green → lime → cream) — app integrations, growth cards
- **Ulraviolet Horizon** (98deg, deep purple → indigo → cyan → white) — the most expansive hero, reserved for peak brand moments
- **Plasma Wash** (vertical, violet → magenta → pink) — creative expression, AI/Magic Studio surfaces
- **Cyan Violet** (135deg, teal → indigo → violet) — secondary product feature variants

All gradients sweep diagonally or vertically; none are radial. Each terminates in a lighter tone to create a sense of atmospheric depth, not flat color blocks.

## Typography Attitude

Canva Sans is humanist and warm — its open apertures and slightly rounded terminals make it feel approachable, not corporate. The system makes one non-obvious choice: display headlines use weight 400, not 600–700. This puts visual mass in the letterforms and the tracking (-0.0100em) rather than the weight, keeping the tone conversational even at 64–80px. The ss02 and ss03 stylistic alternates should be on by default to add personality to the otherwise geometric character set.

## Similar Brands

- **Figma** — Same approach of using a single dominant brand accent (Figma orange, Canva violet) against a white canvas with full-bleed gradient feature panels and flat rounded cards
- **Notion** — Similar comfortable density, custom humanist sans typeface, flat surfaces with hairline borders and barely-there shadows, and the same commitment to a single whisper-tone for body text
- **Spline** — Shared use of saturated multi-color gradients as page backgrounds and feature card fills, with white text overlaid — both treat color as the canvas, not the decoration
- **Stripe** — Similar whisper-tight letter-spacing at display sizes (-0.0100em territory), gradient feature sections, and the pattern of alternating white workspace with chromatic content blocks
- **Linear** — Same ultra-clean flat-surface language with 8px default radius, thin blue-tinted shadows, and pill-shaped navigation elements

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-canva-violet: #8b3dff;
  --color-soft-iris: #a370fc;
  --color-deep-amethyst: #9729ff;
  --color-ember-red: #ff3d4d;
  --color-plasma-pink: #e950f7;
  --color-solar-orange: #ff6105;
  --color-ink-black: #0f1015;
  --color-pure-black: #000000;
  --color-off-black: #231f20;
  --color-slate-smoke: #575a5f;
  --color-pale-mist: #d7d9de;
  --color-paper-white: #ffffff;
  --color-teal-violet-sky: #7d2ae8;
  --gradient-teal-violet-sky: linear-gradient(135deg, rgb(0, 196, 204), rgb(125, 42, 232));
  --color-coral-sunset: #ff6208;
  --gradient-coral-sunset: linear-gradient(rgb(255, 59, 76) 5.8%, rgb(255, 98, 18) 32.1%, rgb(255, 205, 179) 100%);
  --color-emerald-meadow: #00b100;
  --gradient-emerald-meadow: linear-gradient(rgb(0, 125, 38) 0%, rgb(0, 177, 0) 60%, rgb(225, 255, 192) 83%);
  --color-ulraviolet-horizon: #5a32fa;
  --gradient-ulraviolet-horizon: linear-gradient(rgb(153, 43, 255), rgb(90, 50, 250) 30.09%, rgb(19, 163, 181) 56.76%, rgb(147, 232, 246) 76.85%, rgb(241, 235, 255) 95.28%, rgb(255, 255, 255));

  /* Typography — Font Families */
  --font-times: 'Times', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-canva-sans: 'Canva Sans', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-arial: 'Arial', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 14px;
  --leading-caption: 1.38;
  --tracking-caption: -0.14px;
  --text-body: 16px;
  --leading-body: 1.5;
  --tracking-body: -0.16px;
  --text-body-lg: 18px;
  --leading-body-lg: 1.57;
  --tracking-body-lg: -0.18px;
  --text-subheading: 24px;
  --leading-subheading: 1.4;
  --tracking-subheading: -0.24px;
  --text-heading-sm: 28px;
  --leading-heading-sm: 1.33;
  --tracking-heading-sm: -0.28px;
  --text-heading: 32px;
  --leading-heading: 1.25;
  --tracking-heading: -0.32px;
  --text-heading-lg: 36px;
  --leading-heading-lg: 1.25;
  --tracking-heading-lg: -0.36px;
  --text-display: 56px;
  --leading-display: 1.1;
  --tracking-display: -0.56px;
  --text-hero: 64px;
  --leading-hero: 1.1;
  --tracking-hero: -0.64px;
  --text-mega: 80px;
  --leading-mega: 1.1;
  --tracking-mega: -0.8px;

  /* Typography — Weights */
  --font-weight-regular: 400;
  --font-weight-medium: 500;
  --font-weight-semibold: 600;

  /* Spacing */
  --spacing-unit: 4px;
  --spacing-4: 4px;
  --spacing-8: 8px;
  --spacing-12: 12px;
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-44: 44px;
  --spacing-48: 48px;
  --spacing-76: 76px;
  --spacing-212: 212px;

  /* Layout */
  --page-max-width: 1280px;
  --section-gap: 64px;
  --card-padding: 24px;
  --element-gap: 12px;

  /* Border Radius */
  --radius-lg: 8px;
  --radius-2xl: 16px;
  --radius-full: 9999px;

  /* Named Radii */
  --radius-cards: 8px;
  --radius-icons: 8px;
  --radius-pills: 9999px;
  --radius-buttons: 8px;
  --radius-featurepanels: 16px;

  /* Shadows */
  --shadow-subtle: rgba(64, 79, 109, 0.06) 0px 0px 0px 0.5px, rgba(24, 44, 89, 0.137) 0px 2px 4px 0px, rgba(24, 44, 89, 0.07) 0px 6px 12px 0px;
  --shadow-subtle-2: rgba(53, 65, 90, 0.2) 0px 0px 0px 1px inset;
  --shadow-subtle-3: rgba(255, 255, 255, 0.2) 0px 0px 0px 1px inset;

  /* Surfaces */
  --surface-paper-white: #ffffff;
  --surface-white-card: #ffffff;
  --surface-gradient-panel: #7d2ae8;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-canva-violet: #8b3dff;
  --color-soft-iris: #a370fc;
  --color-deep-amethyst: #9729ff;
  --color-ember-red: #ff3d4d;
  --color-plasma-pink: #e950f7;
  --color-solar-orange: #ff6105;
  --color-ink-black: #0f1015;
  --color-pure-black: #000000;
  --color-off-black: #231f20;
  --color-slate-smoke: #575a5f;
  --color-pale-mist: #d7d9de;
  --color-paper-white: #ffffff;
  --color-teal-violet-sky: #7d2ae8;
  --color-coral-sunset: #ff6208;
  --color-emerald-meadow: #00b100;
  --color-ulraviolet-horizon: #5a32fa;

  /* Typography */
  --font-times: 'Times', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-canva-sans: 'Canva Sans', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-arial: 'Arial', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 14px;
  --leading-caption: 1.38;
  --tracking-caption: -0.14px;
  --text-body: 16px;
  --leading-body: 1.5;
  --tracking-body: -0.16px;
  --text-body-lg: 18px;
  --leading-body-lg: 1.57;
  --tracking-body-lg: -0.18px;
  --text-subheading: 24px;
  --leading-subheading: 1.4;
  --tracking-subheading: -0.24px;
  --text-heading-sm: 28px;
  --leading-heading-sm: 1.33;
  --tracking-heading-sm: -0.28px;
  --text-heading: 32px;
  --leading-heading: 1.25;
  --tracking-heading: -0.32px;
  --text-heading-lg: 36px;
  --leading-heading-lg: 1.25;
  --tracking-heading-lg: -0.36px;
  --text-display: 56px;
  --leading-display: 1.1;
  --tracking-display: -0.56px;
  --text-hero: 64px;
  --leading-hero: 1.1;
  --tracking-hero: -0.64px;
  --text-mega: 80px;
  --leading-mega: 1.1;
  --tracking-mega: -0.8px;

  /* Spacing */
  --spacing-4: 4px;
  --spacing-8: 8px;
  --spacing-12: 12px;
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-44: 44px;
  --spacing-48: 48px;
  --spacing-76: 76px;
  --spacing-212: 212px;

  /* Border Radius */
  --radius-lg: 8px;
  --radius-2xl: 16px;
  --radius-full: 9999px;

  /* Shadows */
  --shadow-subtle: rgba(64, 79, 109, 0.06) 0px 0px 0px 0.5px, rgba(24, 44, 89, 0.137) 0px 2px 4px 0px, rgba(24, 44, 89, 0.07) 0px 6px 12px 0px;
  --shadow-subtle-2: rgba(53, 65, 90, 0.2) 0px 0px 0px 1px inset;
  --shadow-subtle-3: rgba(255, 255, 255, 0.2) 0px 0px 0px 1px inset;
}
```
