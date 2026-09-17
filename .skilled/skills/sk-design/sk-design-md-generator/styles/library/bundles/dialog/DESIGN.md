# Dialog — Style Reference
> Neutral showroom with one warm price tag. Every surface is a different tone of off-white; the orange CTA is the only color in the room.

**Theme:** light

Dialog feels like a high-end retail floor plan rendered in digital form — neutral, airy, and unhurried, with one warm accent that acts like a price tag sticker on white linen. The #f7f7f7 near-white background and pure white cards create a surface hierarchy so subtle it reads as continuous space rather than layered depth. PP Radio Grotesk Light at 50-70px is the defining move: a geometric grotesque rendered at its lightest weight makes large headlines feel handwritten on paper rather than stamped — zero aggression, maximum presence. The single orange #f69251 appears exclusively on CTAs, pulling attention the way a sale tag pops in a neutral showroom. Pill-shaped buttons (28px radius) float against square-cornered containers, the only soft shape in an otherwise rectilinear system.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Tangerine Tag | `#f69251` | `--color-tangerine-tag` | Primary CTA buttons, 'Book a demo' pill — warm orange against near-white backgrounds signals action without urgency, echoing the palette of premium retail labels |
| Midnight Ink | `#181825` | `--color-midnight-ink` | Body text, borders — near-black with a barely perceptible blue undertone, softer than pure black for long-form reading |
| Graphite | `#484758` | `--color-graphite` | Secondary body text, descriptive copy, meta information |
| Deep Slate | `#242433` | `--color-deep-slate` | Dark surface backgrounds, card overlays in dark sections |
| Carbon | `#000000` | `--color-carbon` | Headings, icon fills, primary text — used at full weight for maximum legibility |
| Stone | `#636363` | `--color-stone` | Supporting body text, nav labels, secondary labels |
| Pebble | `#949494` | `--color-pebble` | Placeholder text, muted links, disabled states |
| Ash | `#8b8b8b` | `--color-ash` | Tertiary text, icon strokes, faint borders |
| Fog | `#f7f7f7` | `--color-fog` | Page background, section fills — the dominant surface of the entire site |
| Snow | `#ffffff` | `--color-snow` | Card surfaces, nav background, button fill for ghost variant |
| Peach Whisper | `linear-gradient(rgba(255, 219, 184, 0.06) 0%, rgba(255, 255, 255, 0.03) 100%)` | `--color-peach-whisper` | Decorative SVG fills, illustration accent highlights |
| Dusty Rose | `#c97b84` | `--color-dusty-rose` | Semantic accent — appears in hover or highlight states on certain interactive elements |

## Tokens — Typography

### PP Radio Grotesk Light — All hero and section headings. Weight 400 in this geometric grotesque renders visually as 'light' — at 70px the type feels pencil-drawn rather than set, giving large-format headlines an editorial quality no system font can replicate. The signature typographic move of this site. · `--font-pp-radio-grotesk-light`
- **Substitute:** Satoshi Light, DM Sans Light
- **Weights:** 400
- **Sizes:** 32px, 39px, 50px, 70px
- **Line height:** 1.15–1.30
- **Letter spacing:** -0.01em (approx -0.5px at 50px, -0.7px at 70px)
- **OpenType features:** `"blwf", "cv03", "cv04", "cv09", "cv11"`
- **Role:** All hero and section headings. Weight 400 in this geometric grotesque renders visually as 'light' — at 70px the type feels pencil-drawn rather than set, giving large-format headlines an editorial quality no system font can replicate. The signature typographic move of this site.

### Inter — Navigation labels, body copy, input fields, UI labels, subheadings. Weight 400 for body, 500 for nav links and emphasis. The negative letter-spacing is tighter than Inter's default, compressing the text block slightly without feeling cramped. · `--font-inter`
- **Substitute:** Inter (already Google-available)
- **Weights:** 400, 500
- **Sizes:** 12px, 13px, 14px, 16px, 18px, 24px
- **Line height:** 1.20–1.70
- **Letter spacing:** -0.02em at small sizes, -0.01em at mid sizes
- **OpenType features:** `"blwf", "cv03", "cv04", "cv09"`
- **Role:** Navigation labels, body copy, input fields, UI labels, subheadings. Weight 400 for body, 500 for nav links and emphasis. The negative letter-spacing is tighter than Inter's default, compressing the text block slightly without feeling cramped.

### Inter Variable — Tightly set inline body snippets, single-line descriptors. Line-height 1.00 means no leading — used for compact label-style text only. · `--font-inter-variable`
- **Substitute:** Inter
- **Weights:** 400
- **Sizes:** 15px
- **Line height:** 1.00
- **Letter spacing:** -0.01em
- **OpenType features:** `"cv01", "cv05", "cv09", "cv11"`
- **Role:** Tightly set inline body snippets, single-line descriptors. Line-height 1.00 means no leading — used for compact label-style text only.

### Inter Display — Occasional heading contexts at small display sizes, card titles in feature sections. · `--font-inter-display`
- **Substitute:** Inter
- **Weights:** 400
- **Sizes:** 14px
- **Line height:** 1.43
- **Letter spacing:** normal
- **Role:** Occasional heading contexts at small display sizes, card titles in feature sections.

### sans-serif (system fallback) — Icon labels, tooltip text, browser-level UI elements — not a designed choice. · `--font-sans-serif-system-fallback`
- **Weights:** 400
- **Sizes:** 12px
- **Line height:** 1.20
- **Letter spacing:** normal
- **Role:** Icon labels, tooltip text, browser-level UI elements — not a designed choice.

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 12px | 1.2 | — | `--text-caption` |
| body | 16px | 1.5 | — | `--text-body` |
| subheading | 18px | 1.4 | — | `--text-subheading` |
| heading-sm | 24px | 1.33 | — | `--text-heading-sm` |
| heading | 32px | 1.3 | -0.32px | `--text-heading` |
| heading-lg | 50px | 1.2 | -0.5px | `--text-heading-lg` |
| display | 70px | 1.15 | -0.7px | `--text-display` |

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
| 64 | 64px | `--spacing-64` |
| 72 | 72px | `--spacing-72` |
| 80 | 80px | `--spacing-80` |
| 96 | 96px | `--spacing-96` |
| 128 | 128px | `--spacing-128` |
| 160 | 160px | `--spacing-160` |
| 192 | 192px | `--spacing-192` |

### Border Radius

| Element | Value |
|---------|-------|
| cards | 24px |
| small | 8px |
| badges | 100px |
| inputs | 0px |
| buttons | 28px |
| overlays | 32px |
| cardInner | 12px |

### Shadows

| Name | Value | Token |
|------|-------|-------|
| subtle | `rgba(24, 24, 37, 0.12) 0px 2px 3px -2px` | `--shadow-subtle` |
| xl | `rgba(247, 247, 247, 0.5) 0px -40px 40px 0px` | `--shadow-xl` |
| subtle-2 | `rgba(0, 0, 0, 0.04) 0px 1px 2px 0px, rgba(0, 0, 0, 0.02) ...` | `--shadow-subtle-2` |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 80-120px
- **Card padding:** 24px
- **Element gap:** 8-16px

## Components

### Primary CTA Button (Orange Pill)
**Role:** Hero and nav primary action — 'Book a demo'

Background #f69251, text #000000, border-radius 28px, padding 12px 24px. The fully pill-shaped silhouette at 28px radius is the only rounded element class in an otherwise angular layout. Subtle layered shadow: rgba(0,0,0,0.04) 0px 1px 2px, rgba(0,0,0,0.02) 0px 2px 4px, rgba(0,0,0,0.02) 0px 4px 8px. Font: Inter 14-16px weight 500.

### Ghost CTA Button (White Pill)
**Role:** Secondary actions on dark or image-backed surfaces

Background #ffffff, text #000000, border-radius 28px, padding 12px 24px. Same pill shape as primary, but inverted to white fill — reads as outline-adjacent without an explicit border. Used where orange would clash with background.

### Email Input + CTA Inline Form
**Role:** Hero email capture row

Input field: transparent background, border-radius 0px, no padding — appears as a bare underline or bordered rectangle. Paired inline with the orange pill button. Input text #000000, placeholder color #949494 (Pebble). The zero-radius input contrasts sharply with the 28px pill button beside it, creating a deliberate tension between form and function.

### Testimonial Card
**Role:** Social proof in scrolling testimonials section

White (#ffffff) card surface, border-radius 24px, padding 24px. Quote text in Inter 14-16px #181825. Author name in Inter 500 ~14px, role/handle in #636363 Inter 400 12-13px. Avatar image displayed at small size (32-40px) with circular crop. No border — card lifts via box-shadow rgba(24,24,37,0.12) 0px 2px 3px -2px. Placed in a horizontal scroll carousel.

### Product Screenshot Browser Frame
**Role:** Product tour / hero UI illustration

White (#ffffff) card at border-radius 24px with decorative browser chrome: three colored dots (red #c97b84, yellow, green) in top-left at 12px circles. Interior filled with skeleton placeholder blocks at #f7f7f7 and #b2b2b2. Card uses rgba(247,247,247,0.5) 0px -40px 40px 0px shadow at bottom edge — a fade-up vignette that blends the mockup into the page background.

### Navigation Bar
**Role:** Global top navigation

White (#ffffff) background, height ~64px, max-width contained. Logo (Dialog wordmark with arrow icon) left-aligned. Links in Inter 400 14px #636363, spacing 6-8px gaps. 'Book a demo' orange pill button right-aligned. Border-radius 32px on the nav container when scrolled (floating pill nav pattern). No visible bottom border — separates from page via background contrast.

### Feature Badge / Pill Label
**Role:** Category tags, section labels like 'AI product recommender'

Border-radius 100px, background white or #f7f7f7, padding 4-8px 12px. Text Inter 500 12-13px #484758. No colored background — neutral pill that organizes content without adding chroma.

### Section Heading Block
**Role:** Main headline + supporting subtext for each content section

Headline: PP Radio Grotesk Light 50px, letter-spacing -0.01em, color #000000, line-height 1.20. Subtext: Inter 400 16-18px #636363, line-height 1.50. Vertically stacked, center-aligned in hero, left-aligned in feature sections. Gap between headline and subtext: 12-16px.

### Star Rating Row
**Role:** Social proof trust indicators below hero CTA

Inline row of icon + 5-star glyphs in #f69251 orange. Icon badge (Shopify/G2 logo) at 20px followed by five ★ characters. Text Inter 400 12px #636363. Two rating rows displayed side-by-side with 16-24px gap. Acts as micro-credibility anchor beneath the email capture form.

## Do's and Don'ts

### Do
- Use PP Radio Grotesk Light (weight 400) exclusively for headings at 32px+; never substitute Inter for headlines at large sizes
- Apply #f69251 only to primary CTA buttons — never to text, icons, decorative shapes, or backgrounds
- Set all buttons to border-radius 28px (pill shape) regardless of button width; this is the only rounded UI element in the system
- Maintain #f7f7f7 as the page background and #ffffff for all card surfaces — the 2-tone near-white surface system defines the visual plane
- Use Inter at -0.01em to -0.02em letter-spacing for body and nav text — never at default or positive tracking
- Set card shadows to rgba(24,24,37,0.12) 0px 2px 3px -2px — single low-offset shadow, never stacked high-elevation shadows
- Give testimonial and feature cards border-radius 24px with 24px internal padding — do not use smaller radii for large containers

### Don't
- Do not use #f69251 for more than one element category (CTAs only) — introducing orange to icons, text, or decoration breaks the single-accent discipline
- Do not apply border-radius less than 24px to card containers — 8px or 12px radii belong to inner UI chips, not layout-level cards
- Do not use bold or heavy weights (600+) with PP Radio Grotesk — the light grotesque loses its identity at high weight
- Do not introduce colored section backgrounds (blue, green, purple bands) — section variation comes from #f7f7f7 vs #ffffff swaps only
- Do not use drop shadows larger than 8px blur or opacity above 0.12 — the elevation system is deliberately flush with the page plane
- Do not crop or bleed photography to page edges on interior pages — photography lives inside 24px-radius card containers only
- Do not set input fields to a rounded border-radius — inputs use 0px or minimal radius to contrast with the pill button system

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Page Canvas | `#f7f7f7` | Full-bleed page background — the base of the entire composition |
| 1 | Card Surface | `#ffffff` | Testimonial cards, feature cards, browser mockup frames |
| 2 | Dark Card | `#242433` | Feature section dark-mode panels, contrast sections |

## Elevation

Shadows are used at near-invisible intensity — rgba(24,24,37,0.12) at 2px blur and rgba(0,0,0,0.04) layered micro-shadows on buttons. The effect is less about lifting surfaces and more about defining their edges against the #f7f7f7 background. Cards do not compete for vertical attention; they sit in the plane. The rgba(247,247,247,0.5) 0px -40px 40px fade on the browser mockup is the most dramatic shadow on the page, and it fades INTO the background color — erasing depth rather than creating it.

## Imagery

Two modes of imagery coexist. Product screenshots are rendered as browser-chrome wireframe mockups on white card surfaces — functional and diagrammatic, showing the AI chat interface UI rather than lifestyle. Customer testimonials in the second section use editorial photography: close-cropped product still life (perfume bottle, textured surface) and brand identity shots (Delsey luggage, car dashboard detail). These are contained within 24px-radius cards in a horizontal carousel, with no full-bleed photography on the main page. Photography is warm-toned and moody — shot in ambient/low light, desaturated with brown or bronze casts. The contrast between the clinical wireframe mockups and the warm editorial photos is deliberate: product as system, proof as atmosphere.

## Layout

Max-width ~1200px centered on a #f7f7f7 full-bleed background. Hero is a center-stack layout: headline in PP Radio Grotesk at 70px, subtext, then inline email+CTA form, then trust-badge row — all vertically centered with generous whitespace (~120px top padding). The browser mockup floats below, cropped at the bottom viewport edge to hint at scrollable content. Below: alternating content sections using left-aligned headline + body text paired with right-side UI mockups (2-column). Testimonial section breaks the grid into a horizontal scroll carousel with 3-column partial cards visible. Navigation is a floating white pill (border-radius 32px) that appears contained within a header band — minimal, no mega-menu, no sidebar.

## Agent Prompt Guide

**Quick Color Reference**
- Page background: #f7f7f7
- Card surface: #ffffff
- Primary text / headings: #000000
- Body / secondary text: #636363
- CTA button fill: #f69251
- CTA button text: #000000
- Border / subtle divider: #b2b2b2
- Muted / placeholder text: #949494

**Example Component Prompts**

1. **Hero Section**: #f7f7f7 background, full-width centered layout. Headline 'The AI shopping agent that boosts your sales' in PP Radio Grotesk Light 70px, color #000000, letter-spacing -0.70px, line-height 1.15. Subtext 'Guide shoppers in real time, like you would in store.' in Inter 400 18px, color #636363, line-height 1.50. Below: inline row with a bare text input (transparent bg, 0px radius, border-bottom 1px #000) and an orange pill button (#f69251 fill, #000 text, 28px radius, 12px 24px padding, Inter 500 14px). Below that: two star-rating badge rows in #f69251 stars, Inter 400 12px #636363.

2. **Testimonial Card**: White (#ffffff) card, border-radius 24px, padding 24px, shadow rgba(24,24,37,0.12) 0px 2px 3px -2px. Quote in Inter 400 14px #181825, line-height 1.50. Author row: circular avatar 36px, name in Inter 500 14px #000, handle in Inter 400 12px #636363, gap 8px.

3. **Navigation Bar**: White #ffffff pill container, border-radius 32px. Logo left. Nav links in Inter 400 14px #636363 with 6px column gap. 'Book a demo' orange pill button right (#f69251, #000 text, 28px radius, 12px 24px padding).

4. **Feature Section**: #f7f7f7 background, 2-column layout: left = section label pill (100px radius, #f7f7f7 bg, Inter 500 12px #484758) + heading in PP Radio Grotesk Light 50px #000 + body Inter 400 16px #636363; right = white card (24px radius) containing UI screenshot or product mockup.

5. **Browser Mockup Frame**: White card, border-radius 24px, shadow rgba(247,247,247,0.5) 0px -40px 40px 0px at bottom edge. Top-left: three dots at 10px circle (colors: #c97b84, #f69251, #8b8b8b). Interior: skeleton blocks at #f7f7f7 and #b2b2b2 varying widths, row-gap 8px.

## Similar Brands

- **Intercom** — Neutral off-white backgrounds, single warm-brand CTA color, testimonial carousel pattern, Inter-based body type
- **Typeform** — Geometric grotesque display type at light weight for hero headlines, orange-family accent color on pill buttons
- **Gorgias** — AI/e-commerce SaaS with editorial product photography mixed with UI mockup screenshots, near-identical testimonial card layout
- **Klaviyo** — Same pill-nav-bar pattern floating above #f7f7f7 backgrounds, Inter body text with tight letter-spacing
- **Rebuy Commerce** — Shopify-native AI commerce tool with warm accent buttons, light muted surfaces, and wireframe-style product preview mockups

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-tangerine-tag: #f69251;
  --color-midnight-ink: #181825;
  --color-graphite: #484758;
  --color-deep-slate: #242433;
  --color-carbon: #000000;
  --color-stone: #636363;
  --color-pebble: #949494;
  --color-ash: #8b8b8b;
  --color-fog: #f7f7f7;
  --color-snow: #ffffff;
  --color-peach-whisper: #fad7c1;
  --gradient-peach-whisper: linear-gradient(rgba(255, 219, 184, 0.06) 0%, rgba(255, 255, 255, 0.03) 100%);
  --color-dusty-rose: #c97b84;

  /* Typography — Font Families */
  --font-pp-radio-grotesk-light: 'PP Radio Grotesk Light', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-inter: 'Inter', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-inter-variable: 'Inter Variable', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-inter-display: 'Inter Display', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-sans-serif-system-fallback: 'sans-serif (system fallback)', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.2;
  --text-body: 16px;
  --leading-body: 1.5;
  --text-subheading: 18px;
  --leading-subheading: 1.4;
  --text-heading-sm: 24px;
  --leading-heading-sm: 1.33;
  --text-heading: 32px;
  --leading-heading: 1.3;
  --tracking-heading: -0.32px;
  --text-heading-lg: 50px;
  --leading-heading-lg: 1.2;
  --tracking-heading-lg: -0.5px;
  --text-display: 70px;
  --leading-display: 1.15;
  --tracking-display: -0.7px;

  /* Typography — Weights */
  --font-weight-regular: 400;
  --font-weight-medium: 500;

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
  --spacing-64: 64px;
  --spacing-72: 72px;
  --spacing-80: 80px;
  --spacing-96: 96px;
  --spacing-128: 128px;
  --spacing-160: 160px;
  --spacing-192: 192px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 80-120px;
  --card-padding: 24px;
  --element-gap: 8-16px;

  /* Border Radius */
  --radius-md: 4px;
  --radius-lg: 8px;
  --radius-xl: 12px;
  --radius-2xl: 16px;
  --radius-2xl-2: 20px;
  --radius-3xl: 24px;
  --radius-3xl-2: 28px;
  --radius-3xl-3: 32px;
  --radius-full: 48px;
  --radius-full-2: 100px;

  /* Named Radii */
  --radius-cards: 24px;
  --radius-small: 8px;
  --radius-badges: 100px;
  --radius-inputs: 0px;
  --radius-buttons: 28px;
  --radius-overlays: 32px;
  --radius-cardinner: 12px;

  /* Shadows */
  --shadow-subtle: rgba(24, 24, 37, 0.12) 0px 2px 3px -2px;
  --shadow-xl: rgba(247, 247, 247, 0.5) 0px -40px 40px 0px;
  --shadow-subtle-2: rgba(0, 0, 0, 0.04) 0px 1px 2px 0px, rgba(0, 0, 0, 0.02) 0px 2px 4px 0px, rgba(0, 0, 0, 0.02) 0px 4px 8px 0px;

  /* Surfaces */
  --surface-page-canvas: #f7f7f7;
  --surface-card-surface: #ffffff;
  --surface-dark-card: #242433;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-tangerine-tag: #f69251;
  --color-midnight-ink: #181825;
  --color-graphite: #484758;
  --color-deep-slate: #242433;
  --color-carbon: #000000;
  --color-stone: #636363;
  --color-pebble: #949494;
  --color-ash: #8b8b8b;
  --color-fog: #f7f7f7;
  --color-snow: #ffffff;
  --color-peach-whisper: #fad7c1;
  --color-dusty-rose: #c97b84;

  /* Typography */
  --font-pp-radio-grotesk-light: 'PP Radio Grotesk Light', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-inter: 'Inter', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-inter-variable: 'Inter Variable', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-inter-display: 'Inter Display', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-sans-serif-system-fallback: 'sans-serif (system fallback)', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.2;
  --text-body: 16px;
  --leading-body: 1.5;
  --text-subheading: 18px;
  --leading-subheading: 1.4;
  --text-heading-sm: 24px;
  --leading-heading-sm: 1.33;
  --text-heading: 32px;
  --leading-heading: 1.3;
  --tracking-heading: -0.32px;
  --text-heading-lg: 50px;
  --leading-heading-lg: 1.2;
  --tracking-heading-lg: -0.5px;
  --text-display: 70px;
  --leading-display: 1.15;
  --tracking-display: -0.7px;

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
  --spacing-64: 64px;
  --spacing-72: 72px;
  --spacing-80: 80px;
  --spacing-96: 96px;
  --spacing-128: 128px;
  --spacing-160: 160px;
  --spacing-192: 192px;

  /* Border Radius */
  --radius-md: 4px;
  --radius-lg: 8px;
  --radius-xl: 12px;
  --radius-2xl: 16px;
  --radius-2xl-2: 20px;
  --radius-3xl: 24px;
  --radius-3xl-2: 28px;
  --radius-3xl-3: 32px;
  --radius-full: 48px;
  --radius-full-2: 100px;

  /* Shadows */
  --shadow-subtle: rgba(24, 24, 37, 0.12) 0px 2px 3px -2px;
  --shadow-xl: rgba(247, 247, 247, 0.5) 0px -40px 40px 0px;
  --shadow-subtle-2: rgba(0, 0, 0, 0.04) 0px 1px 2px 0px, rgba(0, 0, 0, 0.02) 0px 2px 4px 0px, rgba(0, 0, 0, 0.02) 0px 4px 8px 0px;
}
```
