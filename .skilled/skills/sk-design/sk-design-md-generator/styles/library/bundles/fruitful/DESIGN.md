# Fruitful — Style Reference
> Sun-drenched kitchen herb garden — warm cream surfaces, single deep green accent, botanical softness throughout.

**Theme:** light

Fruitful operates as a sunlit kitchen-table financial practice: warm cream surfaces replace the cold grays of typical fintech, and a single deep forest green acts as the only chromatic voice. Type carries the weight — large, tight-tracked display sizes (up to 91px) that feel hand-set rather than engineered, grounding an otherwise gentle interface. Components are rounded and soft (12px on most containers, 80px on pills), with photographic portraits of real Guides in large rounded frames replacing the abstract product shots common in the category. Elevation is nearly invisible — a single multi-layer shadow reserved for the deepest cards — and borders are thin and quiet. The overall rhythm is: generous whitespace, centered headline bands, 2–3 column card grids, and a warm-but-bright palette that keeps the experience feeling like advice from a friend, not a dashboard.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Forest Floor | `#0b7443` | `--color-forest-floor` | Primary action buttons, active nav state, brand links — deep green against warm cream creates confident without corporate |
| Deep Moss | `#054f31` | `--color-deep-moss` | Green outline accent for tags, dividers, and focused UI edges. Do not promote it to the primary CTA color |
| Vivid Leaf | `#61bc76` | `--color-vivid-leaf` | Green decorative accent for icons, marks, and small graphic details. Do not promote it to the primary CTA color |
| Bright Sprout | `#039855` | `--color-bright-sprout` | Green outline accent for tags, dividers, and focused UI edges |
| Mint Wash | `#d1fadf` | `--color-mint-wash` | Soft highlight panels, nav dividers, secondary surface washes — pale botanical tint that adds warmth without saturation |
| Warm Putty | `#715039` | `--color-warm-putty` | Decorative headings, card borders in warm compositions — toasted brown that bridges cream surfaces and deep green CTAs |
| Sandstone | `#d1a883` | `--color-sandstone` | Decorative icon and card stroke accent in warm layouts — softer sibling of the brown heading color |
| Apricot Cream | `#fee9d1` | `--color-apricot-cream` | Dominant card and section background, hero video backdrop — the signature warm canvas that replaces standard gray |
| Paper White | `#ffffff` | `--color-paper-white` | Page background, nav surface, inverse text on green CTAs — the base layer beneath all warm washes |
| Soft Mist | `#eceff4` | `--color-soft-mist` | Card surfaces on white pages, nav background, secondary panel fill — the only cool neutral, used sparingly |
| Pale Stone | `#f4f4f4` | `--color-pale-stone` | Alternate card surface, image containers — near-white neutral for layering above the cream |
| Graphite Text | `#5b616b` | `--color-graphite-text` | Body copy, helper text, muted descriptions — warm-leaning gray that reads softer than pure black |
| Ink Black | `#000000` | `--color-ink-black` | Primary headings, body text, hairline borders, icon strokes — the structural baseline across all surfaces |

## Tokens — Typography

### PP Neue Montreal — Single-family sans-serif system. Display sizes (45–91px) carry the brand voice — ultra-tight tracking (-0.019em) at 91px makes headlines feel hand-set rather than templated. Weight 500 dominates body and UI text, 600 for subheadings, 700 reserved for emphasis and button labels. The custom font's geometric warmth (rounded terminals, open apertures) is what makes the cream-and-green palette feel friendly instead of generic. · `--font-pp-neue-montreal`
- **Substitute:** Inter or Söhne — both share the geometric warmth and tight tracking behavior at display sizes
- **Weights:** 400, 500, 600, 700
- **Sizes:** 11px, 12px, 13px, 14px, 15px, 16px, 18px, 19px, 20px, 21px, 23px, 24px, 26px, 38px, 45px, 48px, 49px, 60px, 91px
- **Line height:** 0.90, 1.00, 1.10, 1.20, 1.25, 1.32, 1.33, 1.38, 1.40, 1.50
- **Letter spacing:** -0.019em at 91px display, -0.010em at 38–48px headings, -0.004em at 14–16px body
- **OpenType features:** `"ss01" on (if available), tabular numerals for financial figures`
- **Role:** Single-family sans-serif system. Display sizes (45–91px) carry the brand voice — ultra-tight tracking (-0.019em) at 91px makes headlines feel hand-set rather than templated. Weight 500 dominates body and UI text, 600 for subheadings, 700 reserved for emphasis and button labels. The custom font's geometric warmth (rounded terminals, open apertures) is what makes the cream-and-green palette feel friendly instead of generic.

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 11px | 1.4 | -0.004px | `--text-caption` |
| body | 16px | 1.5 | -0.004px | `--text-body` |
| subheading | 20px | 1.33 | -0.004px | `--text-subheading` |
| heading-sm | 24px | 1.32 | -0.01px | `--text-heading-sm` |
| heading | 38px | 1.25 | -0.01px | `--text-heading` |
| heading-lg | 48px | 1.2 | -0.01px | `--text-heading-lg` |
| display | 60px | 1.1 | -0.019px | `--text-display` |
| display-lg | 91px | 0.9 | -0.019px | `--text-display-lg` |

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
| 40 | 40px | `--spacing-40` |
| 48 | 48px | `--spacing-48` |
| 60 | 60px | `--spacing-60` |
| 64 | 64px | `--spacing-64` |
| 72 | 72px | `--spacing-72` |
| 76 | 76px | `--spacing-76` |
| 80 | 80px | `--spacing-80` |
| 100 | 100px | `--spacing-100` |
| 120 | 120px | `--spacing-120` |

### Border Radius

| Element | Value |
|---------|-------|
| nav | 12px |
| cards | 12px |
| pills | 80px |
| video | 12px |
| badges | 80px |
| images | 20px |
| buttons | 12px |
| display-underline | 100px |

### Shadows

| Name | Value | Token |
|------|-------|-------|
| md | `rgba(0, 0, 0, 0.05) 0px 25px 16px 0px, rgba(0, 0, 0, 0.1)...` | `--shadow-md` |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 80px
- **Card padding:** 24px
- **Element gap:** 12px

## Components

### Primary Action Button
**Role:** Main conversion CTA — filled forest green pill

Filled background #0b7443, white text, 12px radius, 12px 24px padding, weight 500 at 16px. Hover transitions to #054f31. Used for the highest-intent action on each page.

### Ghost Button
**Role:** Secondary CTA — outlined neutral

Transparent background, 1px #000000 border, #000000 text, 12px radius, 12px 24px padding, weight 500 at 16px. Pairs alongside the primary action at equal visual weight.

### Pill Navigation Link
**Role:** Nav bar links with soft pill backgrounds

12px to 20px radius, 8px 16px padding, 14–16px text in #000000. Active state uses #0b7443 text on #d1fadf background or a #0b7443 left border indicator.

### Guide Portrait Card
**Role:** Large photographic card featuring a financial Guide

Photograph fills the card, 20px radius, contained in a larger #fee9d1 or #ffffff container with generous padding (24–32px). Guide name overlaid at bottom in white over a subtle gradient, with role tags in pill badges. The portrait is the hero — no decorative borders around the image.

### Trust Badge
**Role:** Laurel-wreath award badge in a 3-column row

Centered icon-and-text composition, no card background. Laurel wreaths in #61bc76 (vivid leaf green), bold display text ("Best", "Excellent") at 24–38px, descriptor text below at 13–14px in #5b616b. Placed on white canvas.

### Hero Video Container
**Role:** Full-width video embed with warm backdrop

12px radius, fills the content max-width, backdrop color #fee9d1 (cream) bleeding beyond the video frame. Caption text appears as a green-bordered label (#d1fadf background, #054f31 text) overlaid near the bottom.

### Section Header Block
**Role:** Numbered section intro with title, description, and CTAs

Left-aligned within content area, large two-line title at 38–48px in #000000, body description at 16px in #5b616b. Small numeric label ("01") in muted gray above the title. Optional CTA row below.

### Green Wash Highlight Label
**Role:** Inline emphasis label with pale green background

#d1fadf background, #054f31 text, 4–6px padding, 4–6px radius, 14px weight 500. Used for in-content highlights like key phrases or feature labels.

### Numbered Step Indicator
**Role:** Large outlined number for ordered process steps

Light weight, 38–48px display size, color #5b616b or #000000. Placed above the step title with 12–16px gap. No background or border — purely typographic.

### Footer
**Role:** Dark or white footer with link columns

#ffffff or #000000 background, multi-column link grid, small body text (13–14px). Logo + social icons row at top. Generous 48–64px internal padding.

### Video Play Overlay
**Role:** Semi-transparent dark overlay with play icon and controls

Subtle dark gradient at bottom of video frame, white play triangle, timecode in small white text. Volume and progress controls appear on hover.

### Tag Pill
**Role:** Small role or category tag on Guide cards

#d1fadf or #ffffff background, 80px radius (full pill), #0b7443 or #000000 text, 5–6px vertical padding, 10–12px horizontal padding, 11–12px font size. Often with a small checkmark or dot icon.

## Do's and Don'ts

### Do
- Use #0b7443 exclusively for the single primary action on any screen — never introduce a second chromatic button color.
- Apply #fee9d1 (Apricot Cream) as the dominant surface for any non-white section to maintain the warm, non-corporate identity.
- Set display type at 48–91px with -0.019em tracking — tight letter-spacing at large sizes is the signature voice.
- Use 12px radius for all buttons, cards, nav elements, and video containers for visual consistency.
- Pair every primary filled button with an equal-weight ghost button (1px black border, transparent fill) as its secondary action.
- Place large photographic portraits (real people, not stock) in 20px-radius containers on warm cream backgrounds to reinforce the human, advisory feel.
- Reserve #039855 and #61bc76 for icon fills, botanical illustrations, and decorative strokes — never for text or buttons.

### Don't
- Don't use the vivid greens (#039855, #61bc76) for body text or headings — they lack the contrast weight of the deep forest green.
- Don't apply #eceff4 (Soft Mist) next to #fee9d1 in the same section — the cool/warm clash breaks the warm atmosphere.
- Don't set body text below 16px or above 20px — the type system is calibrated for that 16–20px sweet spot.
- Don't use sharp corners (0px radius) on any container — even small elements get at least 4–12px radius.
- Don't add drop shadows to buttons, nav, or text — the only shadow belongs on the deepest elevated cards.
- Don't use the brown accent (#715039) for body copy or buttons — it's decorative only, for warm-section headings and card borders.
- Don't introduce a second typeface — PP Neue Montreal covers the full range from 11px captions to 91px display.

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Page Canvas | `#ffffff` | Base page background — the default under all sections |
| 1 | Warm Card | `#fee9d1` | Dominant card and section surface — the signature warm cream that defines the brand |
| 2 | Soft Green Wash | `#d1fadf` | Highlight panels, nav dividers, botanical accent surfaces |
| 3 | Cool Card | `#eceff4` | Secondary card surface on white pages, for contrast against the dominant warm cream |
| 4 | Pale Stone | `#f4f4f4` | Tertiary surface for image containers and layered cards above cream |
| 5 | Inverse Dark | `#000000` | Rare dark sections or overlay surfaces — used very sparingly |

## Elevation

- **Elevated Card:** `rgba(0, 0, 0, 0.05) 0px 25px 16px 0px, rgba(0, 0, 0, 0.1) 0px 10px 10px 0px, rgba(0, 0, 0, 0.1) 0px 3px 6px 0px`

## Imagery

Photography-first: large, warm-toned portrait shots of real people (Guides) filling 20px-radius containers on cream backgrounds. No abstract product mockups, no stock photography, no illustrations except simple laurel-wreath trust badges and small green checkmark icons. Video content is baked into the hero as a full-width embed with a warm beige backdrop, featuring a single person speaking directly to camera — the format is confessional and human, not polished corporate. The warm color temperature of the photography (golden-hour lighting, earth tones in clothing) matches the cream surfaces, creating a unified sunlit palette. Decorative elements are limited to: outlined laurel wreaths in vivid green, small filled checkmarks, and the wordmark leaf icon. No product screenshots, no data visualizations, no abstract geometric graphics.

## Layout

Centered, max-width 1200px content column with generous outer margins. The page opens with a full-bleed white section containing a centered headline band (max ~800px wide for the text, large 60–91px display type) over a 1200px-wide video container. Sections alternate between white canvas and warm cream (#fee9d1) full-bleed bands, each separated by 80px vertical gaps. The trust badge row is a centered 3-column grid on white. Guide cards appear in a 2–3 column scrollable row with a left-aligned numbered section header ("01 / Get paired with a Guide") beside the card group — this asymmetric pairing is a signature layout move. Navigation is a simple horizontal bar with a small wordmark on the left, centered links, and a ghost 'Log in' + filled 'Get started' pair on the right. No sidebar, no mega-menu. Footer is a full-bleed white or dark band with 3–4 columns of links.

## Agent Prompt Guide

## Quick Color Reference
- Text: #000000 (primary), #5b616b (muted/body)
- Background: #ffffff (canvas), #fee9d1 (warm surface)
- Border: #000000 (hairline), #0b7443 (accent), #5b616b (muted)
- Accent: #0b7443 (forest green), #61bc76 (leaf green), #039855 (sprout)
- Surface wash: #d1fadf (mint), #eceff4 (cool card)
- primary action: #0b7443 (filled action)

## Example Component Prompts
1. **Hero headline band**: White canvas, centered. Display text 'Your money, finally figured out.' at 91px weight 500, #000000, letter-spacing -0.019em, line-height 0.9. Subhead at 20px weight 400, #5b616b. Two CTAs side by side: filled primary (#0b7443 background, white text, 12px radius, 12px 24px padding) + ghost secondary (transparent, 1px #000000 border, 12px radius).

2. **Guide portrait card**: 20px radius container, 300px wide, 400px tall, filled with a warm-toned portrait photograph. Below the image: Guide name at 18px weight 600 #000000, role tags as 80px-radius pills (#d1fadf background, #0b7443 text, 11px font). Card sits on #fee9d1 background with 24px internal padding.

3. **Trust badge row**: White canvas, 3-column centered grid with 48px gaps. Each badge: laurel wreath icon in #61bc76 (40px outlined), title text 'Best' / 'Excellent' at 38px weight 700 #000000, descriptor at 14px weight 400 #5b616b. No card background or border.

4. Create a Primary Action Button: #0b7443 background, #ffffff text, 9999px radius, compact pill padding. Use this filled treatment for the main CTA.

5. **Warm cream video section**: Full-bleed #fee9d1 background, 80px vertical padding. Centered video container, 12px radius, max-width 1100px. Green-bordered caption label overlaid: #d1fadf background, #054f31 text, 6px padding, 4px radius, 14px weight 500.

## Typography Voice

The entire type system is one font family at multiple weights — there is no secondary or accent typeface. The signature is the extreme size range: 91px display headlines with -0.019em tracking make the brand feel confident and editorial rather than templated. Body text sits firmly in the 14–16px range with generous 1.4–1.5 line-height. Weight 500 is the workhorse (buttons, nav, body emphasis); 700 is reserved for display and badge titles. Never italic, never condensed — the warmth comes from size and tracking, not stylistic variation.

## Similar Brands

- **Marcus by Goldman Sachs** — Same warm, approachable fintech tone with rounded typography and soft card surfaces — though Marcus uses more photography and less cream
- **Wealthfront** — Similar single-color accent (green) on white with large display headlines, though Wealthfront is cooler and more data-driven
- **Betterment** — Friendly financial guidance brand with rounded UI, warm photography of people, and a single accent color — shares the human-advisory positioning
- **Rocket Money** — Same personal-finance-meets-friend aesthetic with cream-friendly palette and large friendly headlines, though Rocket leans more playful

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-forest-floor: #0b7443;
  --color-deep-moss: #054f31;
  --color-vivid-leaf: #61bc76;
  --color-bright-sprout: #039855;
  --color-mint-wash: #d1fadf;
  --color-warm-putty: #715039;
  --color-sandstone: #d1a883;
  --color-apricot-cream: #fee9d1;
  --color-paper-white: #ffffff;
  --color-soft-mist: #eceff4;
  --color-pale-stone: #f4f4f4;
  --color-graphite-text: #5b616b;
  --color-ink-black: #000000;

  /* Typography — Font Families */
  --font-pp-neue-montreal: 'PP Neue Montreal', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 11px;
  --leading-caption: 1.4;
  --tracking-caption: -0.004px;
  --text-body: 16px;
  --leading-body: 1.5;
  --tracking-body: -0.004px;
  --text-subheading: 20px;
  --leading-subheading: 1.33;
  --tracking-subheading: -0.004px;
  --text-heading-sm: 24px;
  --leading-heading-sm: 1.32;
  --tracking-heading-sm: -0.01px;
  --text-heading: 38px;
  --leading-heading: 1.25;
  --tracking-heading: -0.01px;
  --text-heading-lg: 48px;
  --leading-heading-lg: 1.2;
  --tracking-heading-lg: -0.01px;
  --text-display: 60px;
  --leading-display: 1.1;
  --tracking-display: -0.019px;
  --text-display-lg: 91px;
  --leading-display-lg: 0.9;
  --tracking-display-lg: -0.019px;

  /* Typography — Weights */
  --font-weight-regular: 400;
  --font-weight-medium: 500;
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
  --spacing-32: 32px;
  --spacing-40: 40px;
  --spacing-48: 48px;
  --spacing-60: 60px;
  --spacing-64: 64px;
  --spacing-72: 72px;
  --spacing-76: 76px;
  --spacing-80: 80px;
  --spacing-100: 100px;
  --spacing-120: 120px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 80px;
  --card-padding: 24px;
  --element-gap: 12px;

  /* Border Radius */
  --radius-md: 4px;
  --radius-xl: 12px;
  --radius-2xl: 16px;
  --radius-2xl-2: 20px;
  --radius-3xl: 32px;
  --radius-3xl-2: 40px;
  --radius-full: 64px;
  --radius-full-2: 80px;
  --radius-full-3: 100px;

  /* Named Radii */
  --radius-nav: 12px;
  --radius-cards: 12px;
  --radius-pills: 80px;
  --radius-video: 12px;
  --radius-badges: 80px;
  --radius-images: 20px;
  --radius-buttons: 12px;
  --radius-display-underline: 100px;

  /* Shadows */
  --shadow-md: rgba(0, 0, 0, 0.05) 0px 25px 16px 0px, rgba(0, 0, 0, 0.1) 0px 10px 10px 0px, rgba(0, 0, 0, 0.1) 0px 3px 6px 0px;

  /* Surfaces */
  --surface-page-canvas: #ffffff;
  --surface-warm-card: #fee9d1;
  --surface-soft-green-wash: #d1fadf;
  --surface-cool-card: #eceff4;
  --surface-pale-stone: #f4f4f4;
  --surface-inverse-dark: #000000;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-forest-floor: #0b7443;
  --color-deep-moss: #054f31;
  --color-vivid-leaf: #61bc76;
  --color-bright-sprout: #039855;
  --color-mint-wash: #d1fadf;
  --color-warm-putty: #715039;
  --color-sandstone: #d1a883;
  --color-apricot-cream: #fee9d1;
  --color-paper-white: #ffffff;
  --color-soft-mist: #eceff4;
  --color-pale-stone: #f4f4f4;
  --color-graphite-text: #5b616b;
  --color-ink-black: #000000;

  /* Typography */
  --font-pp-neue-montreal: 'PP Neue Montreal', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 11px;
  --leading-caption: 1.4;
  --tracking-caption: -0.004px;
  --text-body: 16px;
  --leading-body: 1.5;
  --tracking-body: -0.004px;
  --text-subheading: 20px;
  --leading-subheading: 1.33;
  --tracking-subheading: -0.004px;
  --text-heading-sm: 24px;
  --leading-heading-sm: 1.32;
  --tracking-heading-sm: -0.01px;
  --text-heading: 38px;
  --leading-heading: 1.25;
  --tracking-heading: -0.01px;
  --text-heading-lg: 48px;
  --leading-heading-lg: 1.2;
  --tracking-heading-lg: -0.01px;
  --text-display: 60px;
  --leading-display: 1.1;
  --tracking-display: -0.019px;
  --text-display-lg: 91px;
  --leading-display-lg: 0.9;
  --tracking-display-lg: -0.019px;

  /* Spacing */
  --spacing-4: 4px;
  --spacing-8: 8px;
  --spacing-12: 12px;
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-40: 40px;
  --spacing-48: 48px;
  --spacing-60: 60px;
  --spacing-64: 64px;
  --spacing-72: 72px;
  --spacing-76: 76px;
  --spacing-80: 80px;
  --spacing-100: 100px;
  --spacing-120: 120px;

  /* Border Radius */
  --radius-md: 4px;
  --radius-xl: 12px;
  --radius-2xl: 16px;
  --radius-2xl-2: 20px;
  --radius-3xl: 32px;
  --radius-3xl-2: 40px;
  --radius-full: 64px;
  --radius-full-2: 80px;
  --radius-full-3: 100px;

  /* Shadows */
  --shadow-md: rgba(0, 0, 0, 0.05) 0px 25px 16px 0px, rgba(0, 0, 0, 0.1) 0px 10px 10px 0px, rgba(0, 0, 0, 0.1) 0px 3px 6px 0px;
}
```
