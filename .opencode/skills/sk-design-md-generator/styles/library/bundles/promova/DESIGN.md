# Promova — Style Reference
> midnight magazine with one yellow highlighter — a black page, white type, and a vivid lemon swatch that says 'press here'.

**Theme:** dark

Promova is a midnight-magazine language learning surface: near-black canvas, white type, a single electric yellow (#fff050) used as functional punctuation for the primary action and icon highlights. Headlines are set in Nekst, a custom display face used exclusively at oversized scales (40–140px) — never as UI text — giving every screen a confident editorial weight. Body and interface type run on Manrope from 200 to 700, with weight 200 doing the work most sites assign to 300. The system is ruthlessly monochromatic (1% colorfulness) and the visual rhythm comes from oversized type, generous 30px corner radii, and the yellow accent appearing only where action or attention is required. Components feel like magazine spreads rather than dashboard widgets: flat, rounded, low-elevation, with cards that read as paper inserts against the black page.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Jet Black | `#000000` | `--color-jet-black` | Dark supporting neutral for text, icons, and strong contrast. Do not promote it to the primary CTA color |
| Paper White | `#ffffff` | `--color-paper-white` | Primary text on dark canvas, inverted button surface, logo, nav foreground |
| Ash | `#595959` | `--color-ash` | Muted helper text, secondary captions, subdued metadata |
| Fog | `#dddddd` | `--color-fog` | Hairline borders, low-emphasis dividers, card outlines on dark backgrounds |
| Smoke | `#f5f5f5` | `--color-smoke` | Light surface variant for inverted sections, light card fills against the dark page |
| Highlighter Yellow | `#fff050` | `--color-highlighter-yellow` | Yellow supporting accent for decorative details and low-frequency emphasis. Do not promote it to the primary CTA color |
| Periwinkle Wash | `#dfe3ff` | `--color-periwinkle-wash` | Soft accent surface, tinted card backgrounds, decorative wash behind phone mockups |
| Iris Veil | `#bec8ff` | `--color-iris-veil` | Decorative illustration tint, secondary surface accent, cool shadow for hero imagery |

## Tokens — Typography

### Nekst — Display and headline face — used exclusively at 40px and above for hero text, section headers, and oversized editorial statements. Single weight (400) with no bold variant, forcing the size itself to carry emphasis. Custom geometric grotesque with tight apertures that give headlines a sharp, print-poster quality on the black canvas. · `--font-nekst`
- **Substitute:** Bricolage Grotesque, Space Grotesk, or General Sans at the same weights
- **Weights:** 400
- **Sizes:** 14px, 15px, 16px, 18px, 19px, 24px, 40px, 50px, 60px, 70px, 100px, 120px
- **Line height:** 1.00–1.20
- **Role:** Display and headline face — used exclusively at 40px and above for hero text, section headers, and oversized editorial statements. Single weight (400) with no bold variant, forcing the size itself to carry emphasis. Custom geometric grotesque with tight apertures that give headlines a sharp, print-poster quality on the black canvas.

### Manrope — Interface and body workhorse — navigation, body copy, buttons, captions, form labels, and footers. Weight 200 handles light/secondary text, 400–500 for body, 700 for emphasized UI labels. Carries every functional element that isn't editorial display. · `--font-manrope`
- **Substitute:** Inter, Plus Jakarta Sans, or DM Sans
- **Weights:** 200, 400, 500, 700
- **Sizes:** 10px, 14px, 15px, 16px, 18px, 20px, 24px, 25px, 140px
- **Line height:** 1.40–1.67
- **Role:** Interface and body workhorse — navigation, body copy, buttons, captions, form labels, and footers. Weight 200 handles light/secondary text, 400–500 for body, 700 for emphasized UI labels. Carries every functional element that isn't editorial display.

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 10px | 1.5 | — | `--text-caption` |
| body-sm | 14px | 1.5 | — | `--text-body-sm` |
| body-lg | 16px | 1.67 | — | `--text-body-lg` |
| subheading | 18px | 1.5 | — | `--text-subheading` |
| subheading-lg | 20px | 1.44 | — | `--text-subheading-lg` |
| heading-sm | 24px | 1.42 | — | `--text-heading-sm` |
| heading | 40px | 1.2 | — | `--text-heading` |
| heading-lg | 60px | 1.2 | — | `--text-heading-lg` |
| display | 100px | 1 | — | `--text-display` |
| display-xl | 140px | 1 | — | `--text-display-xl` |

## Tokens — Spacing & Shapes

**Density:** comfortable

### Spacing Scale

| Name | Value | Token |
|------|-------|-------|
| 5 | 5px | `--spacing-5` |
| 6 | 6px | `--spacing-6` |
| 10 | 10px | `--spacing-10` |
| 15 | 15px | `--spacing-15` |
| 18 | 18px | `--spacing-18` |
| 20 | 20px | `--spacing-20` |
| 30 | 30px | `--spacing-30` |
| 40 | 40px | `--spacing-40` |
| 45 | 45px | `--spacing-45` |
| 50 | 50px | `--spacing-50` |
| 60 | 60px | `--spacing-60` |
| 70 | 70px | `--spacing-70` |
| 80 | 80px | `--spacing-80` |
| 100 | 100px | `--spacing-100` |
| 113 | 113px | `--spacing-113` |
| 120 | 120px | `--spacing-120` |

### Border Radius

| Element | Value |
|---------|-------|
| tags | 4px |
| cards | 30px |
| buttons | 20px |
| buttons-sm | 10px |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 80px
- **Card padding:** 30px
- **Element gap:** 10px

## Components

### Promova Logo Lockup
**Role:** Brand identity

Lowercase wordmark 'promova' set in Manrope weight 700, white on the black header. The wordmark sits flush-left in the nav bar with no icon glyph or padding buffer — the word IS the mark.

### Header Navigation Bar
**Role:** Primary site navigation

Full-width black bar with Manrope 15px / 500 weight nav items (Languages, Courses, For business, Why Promova, Resources), each with a chevron-down caret. White text, no background fill on items, 30px corner radius on the overall container. Pairs with two right-aligned CTAs.

### Ghost Button (Sign Up)
**Role:** Secondary action in nav

Transparent background, 1px white border (or Fog #dddddd), white Manrope 14px / 700 uppercase text, 10px corner radius, 10px 15px padding. Inverts to filled-white on hover.

### Filled Dark Button (Get Started)
**Role:** Primary action in nav

Black background (#000000), white Manrope 14px / 700 uppercase text, 10px corner radius, 10px 15px padding. On the dark canvas this button reads as a subtle outlined ghost rather than a filled block — the brand relies on the yellow for real action emphasis.

### Yellow CTA Button (Try Promova)
**Role:** Primary conversion action

Highlighter Yellow (#fff050) background, black Manrope 14–16px / 700 uppercase text, 20px corner radius, 20px 30px padding. The single chromatic element on the page — this is where Promova spends its only color budget. Feels like a highlighter mark over a printed page.

### Hero Headline Block
**Role:** Above-the-fold editorial statement

Nekst weight 400 at 100–140px, white text, line-height 1.0. Sits left-aligned on the black canvas, occupying the full left half of the hero. The size and the custom face's geometric sharpness make it read as a magazine cover, not a SaaS headline.

### Content Card
**Role:** Feature, method, and article containers

White or Smoke (#f5f5f5) background, 30px corner radius (the signature radius of the entire system), 30px padding on all sides, no shadow or border. On the dark page, white cards read as paper inserts laid on a black table.

### Method/Feature Card
**Role:** Two-column explanation blocks

White card with 30px radius, contains a Nekst 40–60px heading (black), Manrope 16px body text in Ash #595959, and optional small icon. Arranged in a 2-column grid with 40px gap between cards.

### FAQ Accordion Row
**Role:** Expandable question/answer item

Transparent or dark surface, no background, 1px Fog (#dddddd) bottom border. Question text in Manrope 18–20px / 500, white. Chevron icon right-aligned. No card container — the list feels like editorial copy, not a widget.

### Promo Modal (Usyk Campaign)
**Role:** Overlay marketing card

Periwinkle (#dfe3ff) background, 30px corner radius, centered on the page with a dark backdrop. Contains Nekst 50–60px heading, Manrope 16px body, a yellow CTA button, and a phone mockup illustration to the right. Functions as a single-color editorial insert.

### Phone Mockup Frame
**Role:** Product screenshot container

Iris Veil (#bec8ff) or Periwinkle (#dfe3ff) rounded background, phone device frame rendered at slight angle, app UI visible inside. The cool purple-blue tints differentiate product visuals from the achromatic UI without breaking the monochrome rule.

### Language Pill
**Role:** Language selector tags

White or Smoke background, 4–10px corner radius, Manrope 14px / 500 text, minimal padding (5–10px). Small, functional, no decoration.

### Icon Set
**Role:** Interface iconography

Yellow (#fff050) filled icons for highlighted or interactive glyphs, white outlined icons for secondary UI. Consistent stroke weight, geometric and flat — no skeuomorphism. The yellow icons are the most visible brand mark after the wordmark.

## Do's and Don'ts

### Do
- Use #fff050 exclusively for the single primary CTA on any page — never for decorative fills, secondary buttons, or status indicators
- Set all display headings in Nekst at 40px or larger; never use Nekst for body, nav, or button text
- Apply 30px border-radius to all cards, modals, and major content containers — this radius IS the brand
- Keep the page canvas #000000 across all sections; use white or Smoke (#f5f5f5) cards as the only way to create surface separation
- Use Manrope weight 200 for light/secondary text and weight 700 for emphasized UI labels; weight 500 is the default for body and nav
- Let headlines sit at line-height 1.0 with no extra tracking adjustments — the geometric Nekst at scale carries its own density
- Place icons only as small functional elements or as yellow accent glyphs — never as large decorative illustrations

### Don't
- Don't introduce additional accent colors — blue, green, red, or purple as UI tokens. The system is one-color-on-black
- Don't use Nekst below 40px or for button labels, nav items, or form fields — it loses its editorial power at small sizes
- Don't apply box-shadows to cards or buttons — the flat paper-on-table aesthetic is intentional
- Don't use borders thicker than 1px on dark surfaces — use Fog (#dddddd) for hairlines, never a chromatic border
- Don't alternate section backgrounds between black and light gray — keep the canvas black throughout, with white card inserts for content blocks
- Don't use fully rounded (9999px) pill buttons — the system's button radius is 10–20px, never circular
- Don't place body text below 14px or above 20px — the type scale jumps from body to display via Nekst at 40px+

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Void | `#000000` | Page canvas — the dominant background across all sections |
| 1 | Ash Layer | `#f5f5f5` | Elevated light surface for inverted cards, feature blocks, FAQ items |
| 2 | Periwinkle Mist | `#dfe3ff` | Tinted accent surface for decorative and product showcase areas |
| 3 | Iris Glow | `#bec8ff` | Highest-elevation accent wash for hero visual containers and phone mockup backgrounds |

## Elevation

- **Modal/Overlay:** `0 0 0 100vmax rgba(0,0,0,0.7)`
- **Cards on dark canvas:** `none — flat surfaces, no shadow`

## Imagery

Imagery is minimal and product-led: phone mockups showing the app interface sit against soft purple-blue tints (Periwinkle #dfe3ff, Iris Veil #bec8ff), never against photographic backgrounds. Portrait photography of people (Oleksandr Usyk in the campaign modal) is presented in circular crops, small, and subordinate to type — the typography leads, imagery supports. No full-bleed hero photography. Icons are flat, yellow-filled or white-outlined, geometric. The overall effect is a printed page with sparse illustration, not a screen-first product.

## Layout

Promova uses a max-width 1200px centered column with generous side padding. The hero is an asymmetric split: oversized Nekst headline left, product visual right. Below the hero, content flows in a 2-column card grid for method/feature blocks, then a full-width FAQ accordion list, then a 3-column article grid. Section gaps are large (80px+) to let the black canvas breathe. The header is a simple horizontal bar, not a mega-menu. Sticky behavior is not visually indicated — the nav stays quiet. All sections share the same black background; visual separation comes from white card inserts, not from alternating background colors.

## Agent Prompt Guide

**Quick Color Reference**
- background: #000000
- text: #ffffff
- muted text: #595959
- border: #dddddd
- accent / icon highlight: #fff050
- primary action: no distinct CTA color

**3-5 Example Component Prompts**
No distinct primary action color was observed; use the extracted neutral button treatments instead of inventing a filled CTA color.

2. **Method/Feature card**: White #ffffff background, 30px border-radius, 30px padding. Nekst 50px weight 400 black heading, Manrope 16px weight 400 #595959 body text below, optional yellow #fff050 icon (24px) top-left of the card.

3. **FAQ accordion row**: Transparent background (sits on #000000), 1px bottom border in #dddddd. Question text in Manrope 20px weight 500, #ffffff. Right-aligned chevron icon, white outline. No card container, no background fill.


5. **Navigation bar**: Black #000000 background, 30px border-radius on the bar container. 'promova' wordmark in Manrope 700 white, 15px, flush-left. Nav items (Languages, Courses, For business, Why Promova, Resources) in Manrope 15px weight 500, white, with 20px horizontal spacing. Right side: outlined ghost button (Sign Up, 1px white border, 10px radius) and filled dark button (Get Started, #000000 background, 10px radius, white text).

## Color Discipline

Promova is a 1% colorfulness system. The yellow #fff050 is rationed like a scarce resource — it appears only where the user must act, and nowhere else. No blue links, no green success states, no red error states in the visual language; the system relies on text labels and icon shapes to communicate state. The periwinkle and iris tints (#dfe3ff, #bec8ff) exist only as backgrounds for product mockups, never as UI accents. If a new screen needs a third color, it is a design failure — restructure the component to use the existing palette.

## Similar Brands

- **Duolingo** — Same language-learning category and similar use of a single bold accent color (green for Duolingo, yellow for Promova) against a brand-dominant canvas
- **Linear** — Dark-mode UI with oversized display type, generous corner radii, and a single accent color for interactive elements
- **Notion** — Monochrome-on-black interface with flat cards, minimal shadows, and typography-led hierarchy
- **Babbel** — Language-learning competitor with a similar dark-canvas editorial layout and oversized display headlines
- **Vercel** — Near-black canvas with one chromatic accent, geometric sans-serif display type, and the same flat-paper card aesthetic

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-jet-black: #000000;
  --color-paper-white: #ffffff;
  --color-ash: #595959;
  --color-fog: #dddddd;
  --color-smoke: #f5f5f5;
  --color-highlighter-yellow: #fff050;
  --color-periwinkle-wash: #dfe3ff;
  --color-iris-veil: #bec8ff;

  /* Typography — Font Families */
  --font-nekst: 'Nekst', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-manrope: 'Manrope', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 10px;
  --leading-caption: 1.5;
  --text-body-sm: 14px;
  --leading-body-sm: 1.5;
  --text-body-lg: 16px;
  --leading-body-lg: 1.67;
  --text-subheading: 18px;
  --leading-subheading: 1.5;
  --text-subheading-lg: 20px;
  --leading-subheading-lg: 1.44;
  --text-heading-sm: 24px;
  --leading-heading-sm: 1.42;
  --text-heading: 40px;
  --leading-heading: 1.2;
  --text-heading-lg: 60px;
  --leading-heading-lg: 1.2;
  --text-display: 100px;
  --leading-display: 1;
  --text-display-xl: 140px;
  --leading-display-xl: 1;

  /* Typography — Weights */
  --font-weight-extralight: 200;
  --font-weight-regular: 400;
  --font-weight-medium: 500;
  --font-weight-bold: 700;

  /* Spacing */
  --spacing-5: 5px;
  --spacing-6: 6px;
  --spacing-10: 10px;
  --spacing-15: 15px;
  --spacing-18: 18px;
  --spacing-20: 20px;
  --spacing-30: 30px;
  --spacing-40: 40px;
  --spacing-45: 45px;
  --spacing-50: 50px;
  --spacing-60: 60px;
  --spacing-70: 70px;
  --spacing-80: 80px;
  --spacing-100: 100px;
  --spacing-113: 113px;
  --spacing-120: 120px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 80px;
  --card-padding: 30px;
  --element-gap: 10px;

  /* Border Radius */
  --radius-md: 4px;
  --radius-lg: 10px;
  --radius-xl: 15px;
  --radius-2xl: 20px;
  --radius-3xl: 30px;

  /* Named Radii */
  --radius-tags: 4px;
  --radius-cards: 30px;
  --radius-buttons: 20px;
  --radius-buttons-sm: 10px;

  /* Surfaces */
  --surface-void: #000000;
  --surface-ash-layer: #f5f5f5;
  --surface-periwinkle-mist: #dfe3ff;
  --surface-iris-glow: #bec8ff;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-jet-black: #000000;
  --color-paper-white: #ffffff;
  --color-ash: #595959;
  --color-fog: #dddddd;
  --color-smoke: #f5f5f5;
  --color-highlighter-yellow: #fff050;
  --color-periwinkle-wash: #dfe3ff;
  --color-iris-veil: #bec8ff;

  /* Typography */
  --font-nekst: 'Nekst', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-manrope: 'Manrope', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 10px;
  --leading-caption: 1.5;
  --text-body-sm: 14px;
  --leading-body-sm: 1.5;
  --text-body-lg: 16px;
  --leading-body-lg: 1.67;
  --text-subheading: 18px;
  --leading-subheading: 1.5;
  --text-subheading-lg: 20px;
  --leading-subheading-lg: 1.44;
  --text-heading-sm: 24px;
  --leading-heading-sm: 1.42;
  --text-heading: 40px;
  --leading-heading: 1.2;
  --text-heading-lg: 60px;
  --leading-heading-lg: 1.2;
  --text-display: 100px;
  --leading-display: 1;
  --text-display-xl: 140px;
  --leading-display-xl: 1;

  /* Spacing */
  --spacing-5: 5px;
  --spacing-6: 6px;
  --spacing-10: 10px;
  --spacing-15: 15px;
  --spacing-18: 18px;
  --spacing-20: 20px;
  --spacing-30: 30px;
  --spacing-40: 40px;
  --spacing-45: 45px;
  --spacing-50: 50px;
  --spacing-60: 60px;
  --spacing-70: 70px;
  --spacing-80: 80px;
  --spacing-100: 100px;
  --spacing-113: 113px;
  --spacing-120: 120px;

  /* Border Radius */
  --radius-md: 4px;
  --radius-lg: 10px;
  --radius-xl: 15px;
  --radius-2xl: 20px;
  --radius-3xl: 30px;
}
```
