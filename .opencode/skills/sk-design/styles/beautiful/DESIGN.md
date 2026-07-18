# Beautiful™ — Style Reference
> Warm kitchen on a Sunday morning

**Theme:** light

Beautiful's design system is a warm, domestic tableau: a cream-ivory canvas (#fff5e6) replaces the typical white product background, immediately signaling "home" rather than "software." A single vivid coral accent (#fa7864) punctuates the interface — appearing only on filled action buttons, the serif editorial headings, and one coral CTA banner — while everything else stays restrained: thin black 1px borders, white card surfaces, and an elegant GascogneTS serif paired with the practical Basis Grotesque Pro sans. Components lean generous and pill-shaped, always outlined in black rather than elevated with shadow, always warm-toned rather than cool-neutral. The system reads like a lifestyle magazine spread, not a product catalog: serif hero headlines whisper authority, the coral accent is rationed like saffron, and the cream canvas does the heavy lifting of mood.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Coral Pop | `#fa7864` | `--color-coral-pop` | Orange action color for filled buttons, selected navigation states, and focused conversion moments. |
| Terracotta Whisper | `#dc8264` | `--color-terracotta-whisper` | Orange accent for outlined action borders, linked labels, and lightweight interactive emphasis. |
| Cream Linen | `#fff5e6` | `--color-cream-linen` | Primary page canvas — every section background. The signature surface: warm, not white, immediately domestic. Used for the hero band, the about/letter section, the category circles area, and footer transitions |
| Ink Black | `#000000` | `--color-ink-black` | Primary text, logo, all hairline borders on nav buttons/cards/circles/icons, and the thin rules that define almost every component — the structural skeleton of the entire interface |
| Charcoal | `#282828` | `--color-charcoal` | Neutral form states, badge text, and quiet UI feedback where color should stay understated. |
| Stone | `#707070` | `--color-stone` | Subtle dividers and rules that recede — used where a border needs to exist for spatial structure without competing with the primary black borders |
| Bone | `#e8e8e1` | `--color-bone` | Warm gray for footer borders, input field backgrounds, and the faintest surface separation — the slightly cooler cousin of Cream Linen for creating quiet contrast |
| Pure White | `#ffffff` | `--color-pure-white` | Card surfaces and button text — the only true white in the system, reserved for elevated elements that need to pop above the cream canvas |
| Mist | `#cccccc` | `--color-mist` | Card borders where a soft outline is needed without the weight of black — quieter than #707070, used on the product card grid in the New Arrivals section |

## Tokens — Typography

### GascogneTS — Display and heading serif — used for hero headlines like "Buttercream, whipped to perfection." and section titles like "New Arrivals". This old-style serif is the editorial voice of the brand; it carries the warmth that the sans-serif cannot. Weight 500 for emphasis without going bold. The 1.0–1.2 line-height on 39–52px sizes is tight, creating a confident, magazine-display feel rather than airy editorial · `--font-gascognets`
- **Substitute:** Playfair Display, DM Serif Display, or Cormorant Garamond
- **Weights:** 400, 500
- **Sizes:** 25px, 28px, 30px, 32px, 39px, 43px, 52px
- **Line height:** 1.00, 1.20
- **Letter spacing:** normal
- **Role:** Display and heading serif — used for hero headlines like "Buttercream, whipped to perfection." and section titles like "New Arrivals". This old-style serif is the editorial voice of the brand; it carries the warmth that the sans-serif cannot. Weight 500 for emphasis without going bold. The 1.0–1.2 line-height on 39–52px sizes is tight, creating a confident, magazine-display feel rather than airy editorial

### Basis Grotesque Pro — Primary body and UI sans-serif — nav labels, button text, body copy, product descriptions, and the "NEW" label. The consistently positive letter-spacing (0.019–0.031em) is distinctive: most grotesques tighten tracking at body sizes, but this one opens it, creating a calm, unhurried reading rhythm that matches the domestic warmth. Weight stays at 400 — no bold/medium variations, keeping the voice quiet and conversational · `--font-basis-grotesque-pro`
- **Substitute:** Inter, Söhne, or Neue Haas Grotesk
- **Weights:** 400
- **Sizes:** 10px, 13px, 14px, 16px, 18px, 21px
- **Line height:** 1.20, 1.30
- **Letter spacing:** 0.019–0.031em (wider as size increases: 0.19px at 10px, 0.45px at 16px, 0.65px at 21px)
- **Role:** Primary body and UI sans-serif — nav labels, button text, body copy, product descriptions, and the "NEW" label. The consistently positive letter-spacing (0.019–0.031em) is distinctive: most grotesques tighten tracking at body sizes, but this one opens it, creating a calm, unhurried reading rhythm that matches the domestic warmth. Weight stays at 400 — no bold/medium variations, keeping the voice quiet and conversational

### BasisGrotesquePro-Mono — Monospace variant used for input fields, code-like UI elements, and the uppercase "NEW" label (at 0.056em — the widest tracking in the system, giving small labels a stamped, editorial feel). The wider 0.056em at the label sizes creates the signature tracked-out uppercase micro-text that appears in coral above hero headlines · `--font-basisgrotesquepro-mono`
- **Substitute:** JetBrains Mono, IBM Plex Mono, or Space Mono
- **Weights:** 400
- **Sizes:** 14px, 16px, 18px, 19px
- **Line height:** 1.30, 1.42
- **Letter spacing:** 0.021–0.056em
- **Role:** Monospace variant used for input fields, code-like UI elements, and the uppercase "NEW" label (at 0.056em — the widest tracking in the system, giving small labels a stamped, editorial feel). The wider 0.056em at the label sizes creates the signature tracked-out uppercase micro-text that appears in coral above hero headlines

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 10px | 1.2 | 0.19px | `--text-caption` |
| body | 16px | 1.3 | 0.45px | `--text-body` |
| body-lg | 18px | 1.3 | 0.52px | `--text-body-lg` |
| subheading | 21px | 1.3 | 0.65px | `--text-subheading` |
| heading-sm | 25px | 1.2 | — | `--text-heading-sm` |
| heading | 30px | 1.2 | — | `--text-heading` |
| heading-lg | 39px | 1.1 | — | `--text-heading-lg` |
| display | 52px | 1 | — | `--text-display` |

## Tokens — Spacing & Shapes

**Density:** comfortable

### Spacing Scale

| Name | Value | Token |
|------|-------|-------|
| 6 | 6px | `--spacing-6` |
| 7 | 7px | `--spacing-7` |
| 8 | 8px | `--spacing-8` |
| 10 | 10px | `--spacing-10` |
| 12 | 12px | `--spacing-12` |
| 15 | 15px | `--spacing-15` |
| 16 | 16px | `--spacing-16` |
| 19 | 19px | `--spacing-19` |
| 20 | 20px | `--spacing-20` |
| 22 | 22px | `--spacing-22` |
| 24 | 24px | `--spacing-24` |
| 30 | 30px | `--spacing-30` |
| 32 | 32px | `--spacing-32` |
| 40 | 40px | `--spacing-40` |
| 48 | 48px | `--spacing-48` |
| 60 | 60px | `--spacing-60` |

### Border Radius

| Element | Value |
|---------|-------|
| nav | 20px |
| cards | 0px |
| buttons | 999px |
| circles | 999px |
| buttons-alt | 50px |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 64px
- **Card padding:** 20px
- **Element gap:** 15px

## Components

### Coral Pill Button (Primary Action)
**Role:** Filled CTA — 'Shop Now' in the hero

Fully rounded pill (999px radius), #fa7864 background, white text in Basis Grotesque Pro 16px weight 400 with ~0.045em letter-spacing. Padding approximately 6px vertical, 19px horizontal. No border. The only filled button in the system — use sparingly, one per viewport maximum.

### Outlined Coral Button (Secondary Action)
**Role:** Ghost/outline CTA — 'Discover Beautiful' in the about section

Fully rounded pill (999px radius), transparent background, 1px solid #dc8264 border, #dc8264 text in Basis Grotesque Pro 16px. Same dimensions as the filled variant. The terracotta tone is one step quieter than the primary coral — this is the "you can act, but we won't push" button.

### Nav Pill Button
**Role:** Top navigation items — 'Collections ▼', 'Recipes', 'Our Story'

Fully rounded pill (999px radius), transparent fill, 1px solid #000000 border, black text in Basis Grotesque Pro 14px. Padding ~6px vertical, 19px horizontal. The dropdown arrow on 'Collections' sits inline. These are the quietest interactive elements — black border on cream, no fill until hover.

### Category Circle
**Role:** Navigation categories — Appliances, Cookware, Home, etc.

Perfectly round (999px radius), ~120px diameter. White or cream fill, 1px solid #000 border, product image contained inside. Label sits below in Basis Grotesque Pro 14px black. The circles float on the cream canvas in a horizontal row — no card container, just the circle and its label.

### Hero Banner Card
**Role:** Full-width hero image + text composition

No border, no radius on the image (it bleeds to container edge). Left ~60% is the product photography, right ~40% holds the copy stack: 'NEW' label in coral uppercase mono at 14px with 0.056em tracking, then GascogneTS 39px headline in black, then body text in Basis Grotesque Pro 16px in #282828, then the coral pill button. Generous whitespace between each text element (~15–20px).

### New Arrivals Product Card
**Role:** Product grid items in the 3-column arrivals section

No border-radius, no shadow. White or cream product photo fills the card top, product title in Basis Grotesque Pro 14px below. Cards sit edge-to-edge in a 3-column grid with 20px gaps. No visible card border — the grid structure implies containment, the photography IS the card.

### Coral Banner Strip
**Role:** Full-width section divider — 'Be part of something Beautiful'

Full-bleed #fa7864 background band, ~120px tall. Centered white serif text (GascogneTS 30px weight 500). No padding containers — text floats centered. The only large coral surface in the system; it acts as a visual exclamation point between the category grid and the footer images.

### Signature Mark
**Role:** Personal signature — 'Drew♡' in the about section

Handwritten/script-style signature in #000, ~30px size, placed below body text as a personal sign-off. Functions as a brand-humanizing element, not a component to replicate broadly.

### Uppercase Eyebrow Label
**Role:** 'NEW' label above hero headline

BasisGrotesquePro-Mono 14px, weight 400, #fa7864 color, 0.056em letter-spacing (the widest in the system), uppercase. Sits ~10–15px above its headline. The tracked-out mono uppercase is a signature micro-typographic moment — it stamps a small editorial mark above hero copy.

### Carousel Arrow Button
**Role:** Image carousel navigation — left/right arrows on the hero

Small ~32px circle, #fff5e6 (cream) fill matching canvas, 1px solid #000 border, black arrow icon inside. Sits at the vertical center of the image edge. Blends into the cream background; the black border is the only visual signal.

### Search Icon
**Role:** Top-right search trigger

Plain black magnifying-glass icon, ~20px, no button container, no border. Sits at the far right of the nav row, aligned to the baseline of the logo.

### Centered Logo Lockup
**Role:** Brand wordmark in the header

'Beautiful' set in GascogneTS 32px weight 500, black, with a small ® superscript in Basis Grotesque Pro 10px. Centered above the nav row, flanked by nav buttons on the left and the search icon on the right. The serif logo is the visual anchor of every page.

## Do's and Don'ts

### Do
- Use #fff5e6 (Cream Linen) as the page canvas for every section — never pure white as a background.
- Reserve #fa7864 (Coral Pop) for filled primary action buttons and the single coral banner strip — one coral moment per viewport maximum.
- Use 1px solid #000000 borders on all interactive containers (nav buttons, category circles, carousel arrows) — the thin black line is the system's structural language.
- Set button radius to 999px — every button is a full pill, no exceptions.
- Pair GascogneTS serif headlines with Basis Grotesque Pro body — the serif/sans contrast is the voice of the brand.
- Use the uppercase mono eyebrow label (#fa7864, 0.056em tracking, BasisGrotesquePro-Mono) above hero and section headlines to mark newness or category.
- Maintain positive letter-spacing (0.019–0.031em) on all Basis Grotesque Pro body text — never set body type tight, the openness is intentional.

### Don't
- Don't use shadows for elevation — Beautiful is a flat, bordered system. Depth comes from the cream-to-white surface transition and the coral accent, not from drop shadows.
- Don't introduce a second vivid color — the system is monochromatic warm with one coral. No teals, no greens, no blues as accents.
- Don't use sharp corners (0–8px radius) on buttons or interactive elements — the pill is sacred. Cards and images may be square, but anything clickable rounds fully.
- Don't set body type at bold weights — Basis Grotesque Pro stays at 400. Emphasis comes from the serif, the color, or the size jump, not from weight.
- Don't place the logo flush-left — it must be centered in the header, flanked by nav on the left and search on the right.
- Don't use auto-width or fluid sizing on buttons — pills are content-sized with ~6px vertical and 19px horizontal padding.
- Don't apply the #fa7864 coral to large background areas outside the single banner strip — coral is a foreground accent, not a surface.

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Cream Linen Canvas | `#fff5e6` | Base page background — every section, every band sits on this warm cream |
| 1 | Bone Divider | `#e8e8e1` | Faintest separation — footer rules, input field backgrounds, the barely-there contrast layer |
| 2 | Pure White Card | `#ffffff` | Product card surfaces and button text — the only true white, used to lift content above the cream |
| 3 | Coral Accent Surface | `#fa7864` | The single coral banner strip — a full-bleed accent surface that functions as a section divider |

## Elevation

Beautiful uses a flat, borderless-from-shadow design philosophy. Components do not float — they sit on the cream canvas and are defined by 1px black borders (for interactive elements) or by content-only edges (for product cards and images). The only depth cue is the cream-to-white surface transition (Cream Linen canvas → White card). No drop shadows, no glow, no blur effects. The thin black line carries all structural weight.

## Imagery

Beautiful's visual language is warm, product-forward lifestyle photography with a hand-crafted, domestic feel. Product shots are staged on wooden countertops or against soft neutral backgrounds with natural directional lighting — never sterile white-cyc. Props include linen textiles, scattered ingredients (sprinkles, citrus), ceramic vessels, and fresh botanicals (eucalyptus sprigs). The hero image is a tight product portrait (the cream KitchenAid mixer with a sprinkle-frosted cake) that occupies ~60% of the hero width. Secondary images in the about and New Arrivals sections show people-in-context (a woman in a floral dress seated on a white sofa) and product-only crops. The category circles use isolated product cutouts on white. The footer image strip shows a horizontal row of lifestyle moments (vanity mirrors, brownstone windows, bedroom scenes). Photography is high-key, slightly desaturated, and warm-toned to match the cream canvas. No video, no 3D renders, no illustrations — photography is the only visual medium.

## Layout

Beautiful uses a max-width ~1200px centered layout on a warm cream canvas. The header is a three-zone row: nav pills (left), centered serif logo, search icon (right) — a symmetrical lockup where the logo always sits dead center. The hero is an asymmetric two-column composition: large product image on the left (~60% width), text stack on the right (~40%) with eyebrow label, serif headline, body, and pill CTA stacked vertically with generous gaps. Carousel arrows float at the vertical midline of the image edge. Below the hero, the about section reverses: text block on the left, portrait image on the right — a mirror of the hero composition. The New Arrivals section is a 3-column product image grid with no card chrome. The category navigation is a horizontal row of 7–8 circular icons evenly spaced across the full content width, with a second row of 1–2 circles centered below. The coral banner strip is full-bleed (edge-to-edge) and breaks out of the max-width container to span the viewport. Sections are separated by generous 64px vertical gaps on the cream canvas — no alternating background bands, no dividers, the whitespace itself is the separator. Navigation is minimal: three pill buttons and a search icon, no mega-menu, no sidebar.

## Agent Prompt Guide

**Quick Color Reference**
- primary action: #fa7864 (filled action)
- Accent: #dc8264 (Terracotta Whisper) — outlined ghost buttons, icon strokes
- Text: #000000 (primary), #282828 (secondary)
- Background: #fff5e6 (Cream Linen canvas)
- Surface: #ffffff (cards), #e8e8e1 (dividers)
- Border: #000000 (interactive), #cccccc (product card outlines), #707070 (subtle dividers)

**Example Component Prompts**
1. **Hero Section**: Cream Linen (#fff5e6) full-width background. Left 60%: large product photograph. Right 40%: 'NEW' eyebrow label in #fa7864 uppercase BasisGrotesquePro-Mono 14px with 0.056em letter-spacing, 15px below it a GascogneTS 39px weight 500 black headline, 15px below that Basis Grotesque Pro 16px #282828 body copy, 20px below that a coral pill button (999px radius, #fa7864 fill, white text, 6px 19px padding).

2. **Category Circle Row**: On Cream Linen background, 7 circles in a horizontal row, each 120px diameter with 999px radius, 1px solid #000000 border, white fill, product image centered inside. Label below each in Basis Grotesque Pro 14px black. Evenly distributed across the 1200px content width.

3. **Coral Banner Strip**: Full-bleed #fa7864 band, 120px tall, spanning the entire viewport width. Centered white text in GascogneTS 30px weight 500. No padding container — text sits dead center.

4. **Product Card Grid**: 3-column grid on Cream Linen, 20px gaps. Each card is a white-background product photograph with no border, no radius. Product name in Basis Grotesque Pro 14px black below the image. No card border, no shadow, no chrome — the photo IS the card.

5. **Nav Pill Button**: Transparent background, 1px solid #000000 border, 999px radius, Basis Grotesque Pro 14px black text, 6px vertical / 19px horizontal padding. Place in a horizontal row to the left of the centered logo.

## Typography Voice

The system uses a two-voice typographic structure: GascogneTS (old-style serif) speaks for editorial moments — hero headlines, section titles, the logo — while Basis Grotesque Pro (clean grotesque) handles all functional text — nav, buttons, body, labels. The serif never appears in UI controls; the sans never appears in display. A monospace variant (BasisGrotesquePro-Mono) exists only for the uppercase eyebrow label pattern. The 0.019–0.031em positive letter-spacing on all Basis Grotesque Pro text is the most distinctive typographic choice: most grotesque typefaces tighten tracking at small sizes, but this one opens it, creating a calm, spacious reading rhythm that matches the domestic warmth. The eyebrow label at 0.056em is the widest tracking in the system, used sparingly to stamp a small editorial mark above headlines.

## Similar Brands

- **Our Place** — Warm cream-toned ecommerce with a single vivid accent color (terracotta/coral), serif display headlines paired with a clean sans-serif, thin black borders on pill buttons, and product-forward lifestyle photography on wooden surfaces
- **Caraway Home** — Same warm-neutral canvas approach with a single muted accent color, serif-and-sans typographic pairing, pill-shaped interactive elements, and flat borderless product cards in a centered grid
- **Drew Barrymore's Flower Home (Walmart)** — Directly shares the domestic Drew Barrymore brand DNA — warm cream backgrounds, coral/terracotta accents, serif display type, and the same homey-but-editorial visual language for kitchen and home goods
- **Molly Mahon** — Warm cream canvas, hand-crafted domestic brand aesthetic, serif display headings, pill-shaped UI elements with thin borders, and a single warm accent color used sparingly
- **Sézane** — Editorial serif headlines, generous letter-spacing on body text, cream/off-white backgrounds, pill-shaped buttons with thin black borders, and a rationed single accent color approach

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-coral-pop: #fa7864;
  --color-terracotta-whisper: #dc8264;
  --color-cream-linen: #fff5e6;
  --color-ink-black: #000000;
  --color-charcoal: #282828;
  --color-stone: #707070;
  --color-bone: #e8e8e1;
  --color-pure-white: #ffffff;
  --color-mist: #cccccc;

  /* Typography — Font Families */
  --font-gascognets: 'GascogneTS', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-basis-grotesque-pro: 'Basis Grotesque Pro', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-basisgrotesquepro-mono: 'BasisGrotesquePro-Mono', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;

  /* Typography — Scale */
  --text-caption: 10px;
  --leading-caption: 1.2;
  --tracking-caption: 0.19px;
  --text-body: 16px;
  --leading-body: 1.3;
  --tracking-body: 0.45px;
  --text-body-lg: 18px;
  --leading-body-lg: 1.3;
  --tracking-body-lg: 0.52px;
  --text-subheading: 21px;
  --leading-subheading: 1.3;
  --tracking-subheading: 0.65px;
  --text-heading-sm: 25px;
  --leading-heading-sm: 1.2;
  --text-heading: 30px;
  --leading-heading: 1.2;
  --text-heading-lg: 39px;
  --leading-heading-lg: 1.1;
  --text-display: 52px;
  --leading-display: 1;

  /* Typography — Weights */
  --font-weight-regular: 400;
  --font-weight-medium: 500;

  /* Spacing */
  --spacing-6: 6px;
  --spacing-7: 7px;
  --spacing-8: 8px;
  --spacing-10: 10px;
  --spacing-12: 12px;
  --spacing-15: 15px;
  --spacing-16: 16px;
  --spacing-19: 19px;
  --spacing-20: 20px;
  --spacing-22: 22px;
  --spacing-24: 24px;
  --spacing-30: 30px;
  --spacing-32: 32px;
  --spacing-40: 40px;
  --spacing-48: 48px;
  --spacing-60: 60px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 64px;
  --card-padding: 20px;
  --element-gap: 15px;

  /* Border Radius */
  --radius-2xl: 20px;
  --radius-full: 50px;
  --radius-full-2: 999px;

  /* Named Radii */
  --radius-nav: 20px;
  --radius-cards: 0px;
  --radius-buttons: 999px;
  --radius-circles: 999px;
  --radius-buttons-alt: 50px;

  /* Surfaces */
  --surface-cream-linen-canvas: #fff5e6;
  --surface-bone-divider: #e8e8e1;
  --surface-pure-white-card: #ffffff;
  --surface-coral-accent-surface: #fa7864;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-coral-pop: #fa7864;
  --color-terracotta-whisper: #dc8264;
  --color-cream-linen: #fff5e6;
  --color-ink-black: #000000;
  --color-charcoal: #282828;
  --color-stone: #707070;
  --color-bone: #e8e8e1;
  --color-pure-white: #ffffff;
  --color-mist: #cccccc;

  /* Typography */
  --font-gascognets: 'GascogneTS', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-basis-grotesque-pro: 'Basis Grotesque Pro', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-basisgrotesquepro-mono: 'BasisGrotesquePro-Mono', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;

  /* Typography — Scale */
  --text-caption: 10px;
  --leading-caption: 1.2;
  --tracking-caption: 0.19px;
  --text-body: 16px;
  --leading-body: 1.3;
  --tracking-body: 0.45px;
  --text-body-lg: 18px;
  --leading-body-lg: 1.3;
  --tracking-body-lg: 0.52px;
  --text-subheading: 21px;
  --leading-subheading: 1.3;
  --tracking-subheading: 0.65px;
  --text-heading-sm: 25px;
  --leading-heading-sm: 1.2;
  --text-heading: 30px;
  --leading-heading: 1.2;
  --text-heading-lg: 39px;
  --leading-heading-lg: 1.1;
  --text-display: 52px;
  --leading-display: 1;

  /* Spacing */
  --spacing-6: 6px;
  --spacing-7: 7px;
  --spacing-8: 8px;
  --spacing-10: 10px;
  --spacing-12: 12px;
  --spacing-15: 15px;
  --spacing-16: 16px;
  --spacing-19: 19px;
  --spacing-20: 20px;
  --spacing-22: 22px;
  --spacing-24: 24px;
  --spacing-30: 30px;
  --spacing-32: 32px;
  --spacing-40: 40px;
  --spacing-48: 48px;
  --spacing-60: 60px;

  /* Border Radius */
  --radius-2xl: 20px;
  --radius-full: 50px;
  --radius-full-2: 999px;
}
```
