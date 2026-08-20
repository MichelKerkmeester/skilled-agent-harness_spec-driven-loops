# Flecto — Style Reference
> Botanical greenhouse glasshouse. A warm cream-walled conservatory where deep teal planters hold bright mint seedlings — flat, rounded, alive with green, zero shadows.

**Theme:** mixed

Flecto is a warm botanical rental platform aesthetic: a cream canvas (#fffbec) replaces pure white, deep forest teal (#004737) anchors hero sections and borders, and vivid mint (#56f09f) punctuates interactive moments. Typography is exclusively Aeonik at weight 400 — no bold, no light — relying on negative letter-spacing (-0.043em at display sizes) to create contrast through tightness rather than weight. The system is flat, border-driven, and color-blocked: large rounded surfaces (40–60px radius) in deep teal sit directly on the warm cream, with thin chromatic borders carrying most of the structural weight instead of shadows. Mint appears sparingly as a functional accent on filled buttons, icons, and decorative shapes, never as large surface area.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Forest Ink | `#004737` | `--color-forest-ink` | Dominant brand surface — hero panels, section backgrounds, thick structural borders, nav header, footer blocks. Deep teal absorbs the page and makes cream text glow |
| Mint Pulse | `#56f09f` | `--color-mint-pulse` | Green outline accent for tags, dividers, and focused UI edges. Do not promote it to the primary CTA color |
| Mint Mist | `#d4ffe8` | `--color-mint-mist` | Green accent for outlined action borders, linked labels, and lightweight interactive emphasis. Do not promote it to the primary CTA color |
| Cream Canvas | `#fffbec` | `--color-cream-canvas` | Page background — warm off-white replaces pure white. Border-color on teal sections, card fills on light areas, heading text on dark surfaces |
| Deep Loam | `#032019` | `--color-deep-loam` | Text color on cream surfaces, subtle dark borders. Near-black with a green undertone that harmonizes with the Forest Ink brand color |
| Sage Whisper | `#99b5af` | `--color-sage-whisper` | Muted body text and secondary borders — desaturated green-gray that recedes on cream while staying tonally consistent with the brand palette |
| Stone Mist | `#ccdad7` | `--color-stone-mist` | Hairline dividers, icon borders, subtle background tints on cards within light sections |
| Bone | `#faf2d5` | `--color-bone` | Soft warm card background — slightly warmer and more saturated than cream canvas, used to lift specific content blocks without breaking the tonal family |
| Charcoal | `#222222` | `--color-charcoal` | Body text and standard button borders in neutral contexts. Used when chromatic text is not appropriate |
| Iris Spark | `#8f37ff` | `--color-iris-spark` | Violet outline accent for tags, dividers, and focused UI edges. |

## Tokens — Typography

### Aeonik — Universal typeface — headings, body, UI labels, buttons. Single weight 400 across the entire system; contrast is achieved through size and negative letter-spacing, not weight. This is the signature choice: a monoweight geometric sans where display headlines at 56–74px tighten to -0.043em while body text at 14–16px sits at normal or slightly positive tracking. Tabular numerals ('tnum') are enabled for all instances. · `--font-aeonik`
- **Substitute:** Inter, Satoshi, General Sans
- **Weights:** 400
- **Sizes:** 8px, 9px, 10px, 11px, 12px, 13px, 14px, 15px, 16px, 17px, 18px, 19px, 20px, 24px, 26px, 28px, 32px, 33px, 36px, 56px, 60px, 64px, 66px, 74px
- **Line height:** 1.00–2.88 (contextual)
- **Letter spacing:** -0.0430em at 56px+ (display), -0.0300em at 32–36px (heading), -0.0100em at 18–24px (subheading), normal to +0.0200em at 8–14px (caption/label)
- **OpenType features:** `"tnum" on`
- **Role:** Universal typeface — headings, body, UI labels, buttons. Single weight 400 across the entire system; contrast is achieved through size and negative letter-spacing, not weight. This is the signature choice: a monoweight geometric sans where display headlines at 56–74px tighten to -0.043em while body text at 14–16px sits at normal or slightly positive tracking. Tabular numerals ('tnum') are enabled for all instances.

### roobert — Secondary body face — used for longer descriptive copy, list items, and hero subtext. Warmer and more humanist than Aeonik, providing tonal variety in long-form text while staying in the same single-weight, geometric family. · `--font-roobert`
- **Substitute:** Inter, Söhne, Untitled Sans
- **Weights:** 400
- **Sizes:** 12px, 16px
- **Line height:** 1.40–1.87
- **Role:** Secondary body face — used for longer descriptive copy, list items, and hero subtext. Warmer and more humanist than Aeonik, providing tonal variety in long-form text while staying in the same single-weight, geometric family.

### Arial — Arial — detected in extracted data but not described by AI · `--font-arial`
- **Weights:** 400
- **Sizes:** 16px
- **Line height:** 1.2
- **Role:** Arial — detected in extracted data but not described by AI

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 10px | 1.4 | 0.1px | `--text-caption` |
| body | 14px | 1.4 | — | `--text-body` |
| body-lg | 16px | 1.5 | — | `--text-body-lg` |
| subheading | 20px | 1.3 | -0.2px | `--text-subheading` |
| heading-sm | 28px | 1.2 | -0.56px | `--text-heading-sm` |
| heading | 36px | 1.15 | -1.08px | `--text-heading` |
| heading-lg | 56px | 1.1 | -2.4px | `--text-heading-lg` |
| display | 74px | 1 | -3.18px | `--text-display` |

## Tokens — Spacing & Shapes

**Density:** compact

### Spacing Scale

| Name | Value | Token |
|------|-------|-------|
| 4 | 4px | `--spacing-4` |
| 5 | 5px | `--spacing-5` |
| 6 | 6px | `--spacing-6` |
| 7 | 7px | `--spacing-7` |
| 8 | 8px | `--spacing-8` |
| 10 | 10px | `--spacing-10` |
| 12 | 12px | `--spacing-12` |
| 14 | 14px | `--spacing-14` |
| 15 | 15px | `--spacing-15` |
| 16 | 16px | `--spacing-16` |
| 19 | 19px | `--spacing-19` |
| 20 | 20px | `--spacing-20` |
| 24 | 24px | `--spacing-24` |
| 28 | 28px | `--spacing-28` |
| 38 | 38px | `--spacing-38` |
| 40 | 40px | `--spacing-40` |

### Border Radius

| Element | Value |
|---------|-------|
| cards | 19px |
| pills | 9999px |
| buttons | 40px |
| small-chips | 10px |
| icon-squares | 5.76px |
| large-panels | 60px |

### Shadows

| Name | Value | Token |
|------|-------|-------|
| subtle | `rgba(0, 0, 0, 0.04) 0px 3px 2px 0px` | `--shadow-subtle` |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 40-80px
- **Card padding:** 12-20px
- **Element gap:** 10-12px

## Components

### Filled Mint Button
**Role:** Primary call-to-action (Login, Start)

Background #56f09f, text in Deep Loam (#032019), Aeonik 14px weight 400, padding 10px 24px, border-radius 40px. No border. Sits on white or cream surfaces.

### Outlined Dark Button
**Role:** Secondary action (Book a Demo)

Transparent background, 1px solid #222222 border, text #222222, Aeonik 14px weight 400, padding 10px 20px, border-radius 40px. Inverts to cream-on-teal when on dark hero panels.

### Ghost Pill Button
**Role:** Tertiary action or filter

Background #d4ffe8, text #004737, no border, Aeonik 12px weight 400, padding 6px 14px, border-radius 9999px. Used for tag-like actions and active filter states.

### Hero Panel
**Role:** Full-bleed dark section

Background #004737, border-radius 0 at edges but 19–60px on inner cards, generous 80–120px vertical padding, centered headline at 56–74px Aeonik weight 400 in #fffbec.

### Light Card
**Role:** Content card on cream canvas

Background #ffffff or #faf2d5, 1px solid #ccdad7 border, border-radius 19px, padding 20px. Shadow rgba(0,0,0,0.04) 0px 3px 2px 0px when no border present.

### Tinted Feature Card
**Role:** Highlighted content block

Background #d4ffe8, no border, border-radius 19px, padding 24px, heading at 28px #004737.

### Language Selector
**Role:** Compact utility dropdown

White background, 1px solid #ccdad7 border, border-radius 10px, padding 6px 12px, text 12px Aeonik, chevron icon in Sage Whisper.

### Navigation Bar
**Role:** Top-level site nav

White background, height ~64px, horizontal flex: logo left, nav links center-left, utility buttons right. No bottom border — separation from hero is achieved by color contrast.

### Decorative Shape Module
**Role:** Brand illustration element

Flat vector shapes in #56f09f on dark teal hero — rounded rectangles, connecting lines, organic key/branch motifs. No gradients, no shadows, 100% opaque mint.

### Footer Section Block
**Role:** Dark footer column

Background #004737, text #fffbec at 14px, section headings at 20px, generous padding 40px, border-radius 0 (full-bleed).

### Icon Glyph
**Role:** UI icon system

Outlined 1.5px stroke, 16–20px size, color Sage Whisper (#99b5af) on cream or #fffbec on teal. Rounded line caps. Filled variant in #56f09f for active states.

### Circular Action Button
**Role:** Floating utility (download, scroll)

40px circle, 1px solid #ccdad7 border, white background, centered icon, no shadow.

## Do's and Don'ts

### Do
- Use Aeonik at weight 400 for all text — never introduce bold or light weights; let size and negative tracking create hierarchy
- Apply -0.043em letter-spacing at 56px and above; tighten to -0.030em at 32–36px; open up to +0.020em at caption sizes 8–12px
- Use Forest Ink (#004737) for hero backgrounds and primary structural borders; never use it as a small accent — it is a surface color
- Reach for Mint Pulse (#56f09f) only on filled buttons, active icons, and decorative shapes; its rarity is the system
- Set borders at 1–2px using Forest Ink on dark sections and Stone Mist (#ccdad7) on light sections instead of adding shadows
- Set page background to Cream Canvas (#fffbec) — never pure #ffffff for the base canvas
- Use border-radius 40px on all buttons, 19px on cards, and 9999px on pill tags

### Don't
- Don't introduce additional font weights — the monoweight system is the signature
- Don't use Mint Pulse (#56f09f) as a large surface area — it loses punch; keep it to button-sized and icon-sized moments
- Don't add drop shadows beyond rgba(0,0,0,0.04) 0px 3px 2px 0px — the flatness is intentional
- Don't use pure #ffffff as the page background — the cream warmth is load-bearing for the botanical feel
- Don't apply gradients — the system is strictly flat color blocks
- Don't use #8f37ff (Iris Spark) as a functional color — it is decorative only and should appear rarely
- Don't center-align body copy or lists — only headlines; body text stays left-aligned for reading rhythm

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Page Canvas | `#fffbec` | Base background for all light sections — warm cream replaces pure white |
| 1 | Card Lift | `#faf2d5` | Slightly warmer card surface within cream pages — subtle separation without hard borders |
| 2 | Tinted Highlight | `#d4ffe8` | Mint-tinted surface for selected cards, tag backgrounds, pill highlights |
| 3 | Dark Hero Panel | `#004737` | Full-bleed dark teal sections — hero, footer blocks, feature panels |

## Elevation

- **Card:** `rgba(0, 0, 0, 0.04) 0px 3px 2px 0px`

## Imagery

The site uses flat geometric illustration over photography. The hero features a organic key-and-branch diagram in solid mint (#56f09f) on the deep teal background — rounded rectangles connected by thick lines, evoking a growing plant or network. No product screenshots, no lifestyle photography, no 3D renders. Iconography is outlined 1.5px stroke in a consistent single style. Imagery is decorative atmosphere rather than explanatory content; the brand relies on color and shape language instead of photographs.

## Layout

Page model is max-width 1200px centered, with full-bleed dark teal sections breaking out. The hero is a full-viewport-height dark teal band with centered headline and decorative illustration. Navigation is a white top bar with logo left, links center-left, and utility actions (language, book demo, login) right-aligned. Sections alternate between cream canvas and forest-teal panels, separated by generous 40–80px vertical gaps. Content within light sections is primarily left-aligned text in a single column at 600–800px max width. Cards use a 19px radius and appear in 1- or 3-column grids. The overall rhythm is spacious breathing room between sections, compact information density within them.

## Agent Prompt Guide

## Quick Color Reference
- Page background: #fffbec (Cream Canvas)
- Primary text on cream: #032019 (Deep Loam)
- Dark hero surface: #004737 (Forest Ink)
- Text on dark: #fffbec
- Filled button / accent: #56f09f (Mint Pulse)
- Outlined chromatic action: #d4ffe8 border (Mint Mist ghost pill); primary action: #004737 (outlined action border)

## Example Component Prompts
1. **Hero Section**: Full-bleed #004737 background, border-radius 0, vertical padding 120px. Centered headline at 74px Aeonik weight 400, color #fffbec, letter-spacing -3.18px. Subtext at 16px Aeonik weight 400, color #99b5af. Below: a flat mint (#56f09f) decorative shape composition — rounded rectangles 40–60px radius, connected by 4px-thick lines, 100% opacity, no gradients or shadows.

2. **Navigation Bar**: White (#ffffff) background, height 64px, horizontal flex with 1200px max-width container. Left: Flecto wordmark in Aeonik 20px #004737. Center-left: nav link 'About' in 14px Aeonik #222222. Right group: language pill (12px, 1px #ccdad7 border, 10px radius), outlined 'Book a Demo' button (1px #222222 border, 40px radius, 10px 20px padding), filled 'Login' button (#56f09f background, #032019 text, 40px radius, 10px 24px padding).

3. **Feature Card (Light)**: Background #ffffff, 1px solid #ccdad7 border, border-radius 19px, padding 24px. Heading at 28px Aeonik weight 400, color #004737, letter-spacing -0.56px. Body at 14px roobert, color #032019, line-height 1.40. No shadow.

4. **Ghost Pill Tag**: Background #d4ffe8, no border, border-radius 9999px, padding 6px 14px. Text at 12px Aeonik weight 400, color #004737, letter-spacing +0.024em.

5. **Footer Column Block**: Background #004737 full-bleed, padding 60px top. Section heading at 20px Aeonik #fffbec. Links at 14px roobert #99b5af, 10px row gap.

## Similar Brands

- **Linear** — Same monoweight sans-serif (Aeonik/Inter at single weight) with negative letter-spacing on display sizes and flat color-block hero sections
- **Arc browser** — Cream/warm canvas with a single vivid accent color, rounded surfaces, and flat illustration over photography
- **Notion** — Light cream backgrounds, generous border-radius, and border-driven separation instead of heavy shadows
- **Mercury** — Deep brand-color hero panels with cream/off-white text, flat surfaces, and single-accent-color interaction moments
- **Pitch** — Monoweight geometric sans, warm off-white canvas, and border-radius-driven soft geometry without gradients or shadows

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-forest-ink: #004737;
  --color-mint-pulse: #56f09f;
  --color-mint-mist: #d4ffe8;
  --color-cream-canvas: #fffbec;
  --color-deep-loam: #032019;
  --color-sage-whisper: #99b5af;
  --color-stone-mist: #ccdad7;
  --color-bone: #faf2d5;
  --color-charcoal: #222222;
  --color-iris-spark: #8f37ff;

  /* Typography — Font Families */
  --font-aeonik: 'Aeonik', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-roobert: 'roobert', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-arial: 'Arial', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 10px;
  --leading-caption: 1.4;
  --tracking-caption: 0.1px;
  --text-body: 14px;
  --leading-body: 1.4;
  --text-body-lg: 16px;
  --leading-body-lg: 1.5;
  --text-subheading: 20px;
  --leading-subheading: 1.3;
  --tracking-subheading: -0.2px;
  --text-heading-sm: 28px;
  --leading-heading-sm: 1.2;
  --tracking-heading-sm: -0.56px;
  --text-heading: 36px;
  --leading-heading: 1.15;
  --tracking-heading: -1.08px;
  --text-heading-lg: 56px;
  --leading-heading-lg: 1.1;
  --tracking-heading-lg: -2.4px;
  --text-display: 74px;
  --leading-display: 1;
  --tracking-display: -3.18px;

  /* Typography — Weights */
  --font-weight-regular: 400;
  --font-weight-medium: 500;

  /* Spacing */
  --spacing-4: 4px;
  --spacing-5: 5px;
  --spacing-6: 6px;
  --spacing-7: 7px;
  --spacing-8: 8px;
  --spacing-10: 10px;
  --spacing-12: 12px;
  --spacing-14: 14px;
  --spacing-15: 15px;
  --spacing-16: 16px;
  --spacing-19: 19px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-28: 28px;
  --spacing-38: 38px;
  --spacing-40: 40px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 40-80px;
  --card-padding: 12-20px;
  --element-gap: 10-12px;

  /* Border Radius */
  --radius-md: 3.36px;
  --radius-md-2: 5.76px;
  --radius-lg: 10px;
  --radius-xl: 14.4px;
  --radius-2xl: 19px;
  --radius-3xl: 25.4118px;
  --radius-3xl-2: 28.8px;
  --radius-3xl-3: 37px;
  --radius-3xl-4: 40px;
  --radius-3xl-5: 46px;
  --radius-full: 60px;

  /* Named Radii */
  --radius-cards: 19px;
  --radius-pills: 9999px;
  --radius-buttons: 40px;
  --radius-small-chips: 10px;
  --radius-icon-squares: 5.76px;
  --radius-large-panels: 60px;

  /* Shadows */
  --shadow-subtle: rgba(0, 0, 0, 0.04) 0px 3px 2px 0px;

  /* Surfaces */
  --surface-page-canvas: #fffbec;
  --surface-card-lift: #faf2d5;
  --surface-tinted-highlight: #d4ffe8;
  --surface-dark-hero-panel: #004737;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-forest-ink: #004737;
  --color-mint-pulse: #56f09f;
  --color-mint-mist: #d4ffe8;
  --color-cream-canvas: #fffbec;
  --color-deep-loam: #032019;
  --color-sage-whisper: #99b5af;
  --color-stone-mist: #ccdad7;
  --color-bone: #faf2d5;
  --color-charcoal: #222222;
  --color-iris-spark: #8f37ff;

  /* Typography */
  --font-aeonik: 'Aeonik', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-roobert: 'roobert', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-arial: 'Arial', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 10px;
  --leading-caption: 1.4;
  --tracking-caption: 0.1px;
  --text-body: 14px;
  --leading-body: 1.4;
  --text-body-lg: 16px;
  --leading-body-lg: 1.5;
  --text-subheading: 20px;
  --leading-subheading: 1.3;
  --tracking-subheading: -0.2px;
  --text-heading-sm: 28px;
  --leading-heading-sm: 1.2;
  --tracking-heading-sm: -0.56px;
  --text-heading: 36px;
  --leading-heading: 1.15;
  --tracking-heading: -1.08px;
  --text-heading-lg: 56px;
  --leading-heading-lg: 1.1;
  --tracking-heading-lg: -2.4px;
  --text-display: 74px;
  --leading-display: 1;
  --tracking-display: -3.18px;

  /* Spacing */
  --spacing-4: 4px;
  --spacing-5: 5px;
  --spacing-6: 6px;
  --spacing-7: 7px;
  --spacing-8: 8px;
  --spacing-10: 10px;
  --spacing-12: 12px;
  --spacing-14: 14px;
  --spacing-15: 15px;
  --spacing-16: 16px;
  --spacing-19: 19px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-28: 28px;
  --spacing-38: 38px;
  --spacing-40: 40px;

  /* Border Radius */
  --radius-md: 3.36px;
  --radius-md-2: 5.76px;
  --radius-lg: 10px;
  --radius-xl: 14.4px;
  --radius-2xl: 19px;
  --radius-3xl: 25.4118px;
  --radius-3xl-2: 28.8px;
  --radius-3xl-3: 37px;
  --radius-3xl-4: 40px;
  --radius-3xl-5: 46px;
  --radius-full: 60px;

  /* Shadows */
  --shadow-subtle: rgba(0, 0, 0, 0.04) 0px 3px 2px 0px;
}
```
