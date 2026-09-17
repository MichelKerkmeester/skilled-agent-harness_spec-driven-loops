# Seed — Style Reference
> living organism under laboratory glass

**Theme:** light

Seed uses a botanical-clinical language: warm snow-white canvas, deep forest green surfaces, and whisper-light headline weights (300–350) that read more like a peer-reviewed journal than a supplement brand. The palette is almost monochrome — 93% achromatic — with a single vivid lime (#d3fa99) used as functional punctuation for badges and 'New' tags. Components are deliberately weightless: pill-shaped controls, 16px-radius cards, no drop shadows, no gradients, no decorative borders. The visual restraint IS the brand — scientific credibility earned through typographic confidence and chromatic silence, not through visual volume.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Forest Depths | `#1c3a13` | `--color-forest-depths` | Primary brand color — filled CTAs, dark section backgrounds, navigation surfaces, and primary body text. A near-black green that reads as ink on snow-white and as depth in dark sections |
| Lime Pulse | `#d3fa99` | `--color-lime-pulse` | Green wash for highlight backgrounds, decorative bands, and soft emphasis behind content. |
| Sage Moss | `#757c5d` | `--color-sage-moss` | Product variant accent — DM-02 Daily Multivitamin card and supporting elements. Muted green that harmonizes with Forest Depths without competing |
| Olive Gold | `#9f995b` | `--color-olive-gold` | Yellow wash for highlight backgrounds, decorative bands, and soft emphasis behind content. |
| Eucalyptus | `#698e79` | `--color-eucalyptus` | Product variant accent — PM-02 Sleep + Restore card and supporting elements. Cooler green-blue for the evening product |
| Snow White | `#fcfcf7` | `--color-snow-white` | Page canvas, card surfaces, button text, and primary inverse text. A warm off-white (not pure white) that softens the high-contrast dark green and reads organic rather than clinical-sterile |
| Warm Stone | `#eeeee9` | `--color-warm-stone` | Secondary surface — alternating section backgrounds, subtle panels, and muted separators. Sits between Snow White and the dark sections to create quiet rhythm |
| Frosted Glass | `#c4c7c4` | `--color-frosted-glass` | Translucent surface and frosted-glass overlay backgrounds (used with backdrop-filter: blur). Also serves as a muted neutral surface for content cards on white sections |
| Ash | `#b3b3b3` | `--color-ash` | Disabled button backgrounds, muted button states, and low-emphasis borders |
| Pewter | `#666666` | `--color-pewter` | Secondary body text, captions, and low-emphasis helper text. Provides one tier of text de-emphasis below primary Forest Depths |
| Ink | `#000000` | `--color-ink` | Primary body text on light sections where maximum contrast is needed. Used sparingly — most text defaults to Forest Depths for tonal warmth |

## Tokens — Typography

### Seed Sans — Primary brand typeface — used for all UI, headings, body, navigation, and buttons. Weights 300–350 at display sizes (40–48px) is the signature choice: whisper-light headlines convey scientific confidence through restraint, not volume. Most CPG brands shout with 700-weight headlines; Seed whispers with 300. · `--font-seed-sans`
- **Substitute:** Inter (weights 300, 400, 500) or General Sans
- **Weights:** 300, 350, 400, 500
- **Sizes:** 10px, 12px, 14px, 16px, 18px, 20px, 24px, 32px, 36px, 40px, 48px
- **Line height:** 0.90–2.19
- **Letter spacing:** -0.72px at 48px, -0.4px at 40px, -0.48px at 24px, -0.18px at 18px, normal at 16px and below
- **OpenType features:** `"ss05" on`
- **Role:** Primary brand typeface — used for all UI, headings, body, navigation, and buttons. Weights 300–350 at display sizes (40–48px) is the signature choice: whisper-light headlines convey scientific confidence through restraint, not volume. Most CPG brands shout with 700-weight headlines; Seed whispers with 300.

### Seed Sans Mono — Monospaced companion for product codes (DS-01®, DM-02™), ingredient lists, and data/specs. The slight positive letter-spacing (+0.015em) creates a measured, clinical tone. · `--font-seed-sans-mono`
- **Substitute:** JetBrains Mono or IBM Plex Mono
- **Weights:** 300, 400
- **Sizes:** 12px, 16px
- **Line height:** 1.50
- **Letter spacing:** 0.0150em
- **Role:** Monospaced companion for product codes (DS-01®, DM-02™), ingredient lists, and data/specs. The slight positive letter-spacing (+0.015em) creates a measured, clinical tone.

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| micro | 10px | 1 | — | `--text-micro` |
| label | 12px | 1.5 | — | `--text-label` |
| caption | 14px | 1.4 | — | `--text-caption` |
| body-sm | 16px | 1.5 | — | `--text-body-sm` |
| body | 18px | 1.3 | -0.18px | `--text-body` |
| subheading | 24px | 1.2 | -0.48px | `--text-subheading` |
| heading-sm | 32px | 1.5 | — | `--text-heading-sm` |
| heading | 36px | 1 | — | `--text-heading` |
| heading-lg | 40px | 1.1 | -0.4px | `--text-heading-lg` |
| display | 48px | 1.1 | -0.72px | `--text-display` |

## Tokens — Spacing & Shapes

**Base unit:** 8px

**Density:** comfortable

### Spacing Scale

| Name | Value | Token |
|------|-------|-------|
| 8 | 8px | `--spacing-8` |
| 16 | 16px | `--spacing-16` |
| 24 | 24px | `--spacing-24` |
| 32 | 32px | `--spacing-32` |
| 40 | 40px | `--spacing-40` |
| 48 | 48px | `--spacing-48` |
| 56 | 56px | `--spacing-56` |
| 64 | 64px | `--spacing-64` |
| 80 | 80px | `--spacing-80` |
| 96 | 96px | `--spacing-96` |
| 128 | 128px | `--spacing-128` |

### Border Radius

| Element | Value |
|---------|-------|
| cards | 16px |
| badges | 1000px |
| inputs | 8px |
| buttons | 1000px |
| large-cards | 32px |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 64px
- **Card padding:** 16px
- **Element gap:** 8px

## Components

### Primary Filled Button
**Role:** Main call-to-action across the site

Pill-shaped (1000px radius), Forest Depths (#1c3a13) background, Snow White (#fcfcf7) text, Seed Sans 16px/400. Padding 16px vertical × 24px horizontal. No border, no shadow. This is the only filled button style and carries the highest visual weight on the page.

### Ghost Outlined Button
**Role:** Secondary action on dark or image backgrounds

Transparent background, 1.5px solid Snow White (#fcfcf7) border, Snow White text, 1000px radius, 16px/24px padding. Used for 'Sign in' and actions over imagery or dark green sections.

### Inverted Light Button
**Role:** Secondary action on white backgrounds

Snow White (#fcfcf7) background, 1.5px solid Forest Depths (#1c3a13) border, Forest Depths text, 1000px radius, 16px/24px padding. Mirrors the ghost button for light-surface contexts.

### Text Link with Arrow
**Role:** Inline navigation and secondary navigation

No background, no border, 0px radius. Forest Depths text, 1.5px solid underline, 7px/10.5px padding. Appended with a right-arrow glyph (→) for 'Shop Now', 'Shop All', 'Shop Sale' style links.

### Sale Badge
**Role:** Promotional callout for discounts

Lime Pulse (#d3fa99) background, Forest Depths text, 1000px radius, 6px vertical × 8px horizontal padding. The only badge style using the vivid accent color. Small but immediately scannable.

### Product Tag Badge
**Role:** 'New' indicator on product cards

Translucent Snow White background (rgba(252,252,247,0.2)), Snow White text, 1000px radius, 6px/8px padding. Sits on the top-left of product cards over the product photo.

### Product Card (Dark Section)
**Role:** Product showcase on Forest Depths background

Transparent background within the dark green section, 16px border-radius, no shadow, no border. Contains: product code in pill outline, product name (Seed Sans 24px/350), product photo, 'Shop Now' button, and price text (Seed Sans 12px/500 uppercase). Cards sit directly on the dark surface with no visible container.

### Feature Card (Light Section)
**Role:** Science and content cards on white sections

Transparent or Frosted Glass (#c4c7c4) background, 16px border-radius, no shadow. Used for science modules, ingredient breakdowns, and quiz steps. Frosted Glass variant uses backdrop-filter: blur(37.5px) for an apothecary-glass effect.

### Navigation Bar
**Role:** Primary site navigation

Full-width Snow White background, sticky. Left: 'Seed' wordmark + green dot accent. Center/left: nav links (Shop, Science, Learn). Right: 'Sign in' ghost button + 'Get Started' primary filled button. Height 64–80px. Horizontal padding 24–48px.

### Promo Banner
**Role:** Top-of-page announcement bar

Full-bleed thin band at the very top (40px height). Snow White background, Forest Depths text, 12px/500 uppercase Seed Sans. Contains a small icon + short announcement + inline link.

### Input Field
**Role:** Quiz answers, email capture, form inputs

Transparent background, 1.5px solid Snow White border, Snow White text, 8px border-radius, 14px/20px padding. Placeholder text in semi-transparent Snow White. Used on dark green sections only.

### Product Code Pill
**Role:** Product identifier above names (DS-01®, DM-02™, etc.)

1.5px solid outline in Snow White or Forest Depths (depending on background), 1000px radius, 6px/8px padding. Text in Seed Sans 12px/500. The outline + pill combo creates a 'specimen label' aesthetic.

## Do's and Don'ts

### Do
- Use Forest Depths (#1c3a13) for all primary CTAs, dark sections, and primary text — it is the only chromatic authority on the page
- Use weight 300–350 for all display and heading text (32px and above); reserve weight 400–500 for body, buttons, and labels
- Apply Lime Pulse (#d3fa99) only for sale badges, highlight pills, and small functional emphasis — never for backgrounds larger than a badge or for body text
- Use 1000px border-radius for all buttons, badges, tags, and pill-shaped elements — the fully rounded shape is a defining visual signature
- Set section backgrounds to either Snow White (#fcfcf7) or Forest Depths (#1c3a13) — avoid introducing intermediate surface colors
- Apply the -0.015em to -0.02em letter-spacing tightening at all display sizes (24px and above) to match the brand's refined, journal-like typographic texture
- Use Seed Sans Mono for all product codes (DS-01®, DM-02™) and ingredient/spec lists to reinforce the clinical-scientific tone

### Don't
- Do not introduce drop shadows, box-shadows, or elevation effects — the design is intentionally flat; shadows would break the weightless aesthetic
- Do not use gradients of any kind — the system is purely flat color fields, including on CTAs and hero sections
- Do not use weight 600+ for headlines — bold or black weights would shatter the whisper-light, scientific-journal voice
- Do not use saturated colors outside the five accent greens (#1c3a13, #d3fa99, #757c5d, #9f995b, #698e79) — no blues, reds, or purples in the brand system
- Do not use pure white (#ffffff) — always use Snow White (#fcfcf7); the warm tint is what makes the palette feel organic rather than clinical
- Do not use square or 4–8px radii on buttons or badges — the pill shape (1000px) is non-negotiable for primary interactive elements
- Do not fill large areas with Lime Pulse (#d3fa99) — it is an accent color, not a surface; confine it to badges and small emphasis elements

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Page Canvas | `#fcfcf7` | Default body and most content section background — warm off-white sets organic, non-clinical tone |
| 1 | Card Surface | `#eeeee9` | Subtle elevated panels and alternating section bands — one tier above canvas |
| 2 | Dark Section | `#1c3a13` | Full-bleed dark green bands for product showcases and feature callouts — flips the entire surface to deep brand green |
| 3 | Accent Highlight | `#d3fa99` | Badge backgrounds and emphasis callouts — vivid lime as the rare chromatic punctuation |

## Elevation

The design system is intentionally shadowless. All visual hierarchy is achieved through color contrast (dark green on white, white on dark green), typographic weight shifts (300 vs 400), and spatial separation — never through drop shadows or elevation effects. This flatness reinforces the scientific, clinical-illustration aesthetic; shadows would introduce decorative depth that conflicts with the 'specimen under glass' metaphor.

## Imagery

Imagery is high-key, naturalistic product photography: supplement jars photographed on organic surfaces (wooden counters, natural light) with shallow depth of field and soft bokeh backgrounds. The product jars themselves are frosted glass with colored contents (dark green for DS-01, olive for AM-02, sage for DM-02, eucalyptus for PM-02) and minimal labeling. The photography style is editorial-science — closer to a Kinfolk magazine spread than a CPG ad. No lifestyle people, no staged scenarios, no stock photography. The second key visual element is a delicate, organic line illustration of branching microbiome structures in muted green — used in science sections to visualize biological concepts with scientific-journal precision. Icons appear to be custom thin-stroke line icons, monochrome in Forest Depths or Snow White depending on background.

## Layout

The page uses a max-width 1200px centered grid with consistent 24px horizontal page margins. The hero is a full-bleed lifestyle photograph with left-aligned headline overlay (text-left/image-right at ~50/50 split). Below the hero, sections alternate between Snow White and Forest Depths backgrounds at full-bleed width, creating dramatic dark/light rhythm. The product showcase section uses a 4-column equal-width card grid with equal gutters (16px row/column gap). Content sections use a 2-column asymmetric layout: ~40% text-left, ~60% image-right with generous 64–96px vertical padding. Navigation is a sticky top bar (64–80px) with horizontal link distribution. Section gaps are large (64–96px) creating spacious, editorial breathing room. The overall density is low — the page prioritizes typographic and photographic impact over information density.

## Agent Prompt Guide

## Quick Color Reference
- Primary text: #1c3a13 (Forest Depths)
- Page background: #fcfcf7 (Snow White)
- Dark section background: #1c3a13 (Forest Depths)
- Accent / badge: #d3fa99 (Lime Pulse)
- Secondary surface: #eeeee9 (Warm Stone)
- primary action: #1c3a13 (filled action)

## Example Component Prompts

1. **Primary CTA Button**: Create a pill button with 1000px border-radius, background #1c3a13 (Forest Depths), text #fcfcf7 (Snow White), Seed Sans 16px weight 400, padding 16px vertical × 24px horizontal. No border, no shadow. Use for all main calls-to-action.

2. **Hero Headline**: Set a display headline at 48px in Seed Sans weight 350, color #1c3a13, line-height 1.1, letter-spacing -0.72px. Pair with body text at 16px weight 400 in #1c3a13, line-height 1.5. The whisper-light weight at display size is the signature.

3. **Product Card**: Build a card on a Forest Depths (#1c3a13) section background. 16px border-radius, no shadow, no visible border. Include a product code pill (1.5px solid #fcfcf7 outline, 1000px radius, 12px/500 uppercase text), product name in Seed Sans 24px/350 in #fcfcf7, a product jar image, and a 'Shop Now' primary filled button.

4. **Sale Badge**: Create a small pill badge: 1000px radius, background #d3fa99 (Lime Pulse), text #1c3a13 (Forest Depths) in Seed Sans 12px weight 500, padding 6px vertical × 8px horizontal. Place top-left on promotional cards.

5. **Dark Section with Content**: Build a full-bleed section with #1c3a13 background. Left column (40%): heading in Seed Sans 40px/350 in #fcfcf7, subtext in 16px/400 in #fcfcf7, and a ghost button (transparent bg, 1.5px solid #fcfcf7 border, #fcfcf7 text, 1000px radius). Right column (60%): scientific illustration or product image.

## Color Philosophy

The palette is built on a single chromatic pillar (Forest Depths #1c3a13) supported by one warm neutral (Snow White #fcfcf7) and one vivid accent (Lime Pulse #d3fa99). The deep green is so dark it reads as near-black, giving the brand the gravity of black-on-white editorial design while maintaining botanical identity. Lime Pulse is the only color that feels 'switched on' — it appears only where the system needs to shout (sales, newness, emphasis). This extreme restraint (93% achromatic content) is the visual argument: a microbiome brand that trusts science over marketing spectacle.

## Typography Philosophy

Seed Sans at weights 300–350 for display sizes is the most distinctive typographic choice. At 40–48px, weight 350 creates a 'whisper headline' effect — the text is present and authoritative but never aggressive. The tight letter-spacing (-0.72px at 48px) pulls the light strokes together, preventing them from looking anemic. The contrast between whisper-light headlines and confident 400-weight body text creates a dual-voice system: science journal (headlines) meets clinical reference (body). The custom 'ss05' stylistic set should always be enabled.

## Similar Brands

- **Aesop** — Same near-monochrome palette (deep brown/green + warm off-white), whisper-light serif/sans headlines, and pill-shaped minimal buttons with scientific-apothecary restraint
- **Allbirds** — Same flat-design approach with no shadows, generous whitespace, and a single dominant brand color applied as full-bleed dark sections alternating with white
- **Oatly** — Same light display weights at large sizes creating a conversational, non-corporate headline voice, paired with pill buttons and flat surfaces
- **Whoop** — Same dark-band-meets-white-section alternating rhythm with tight typographic tracking and product-forward card grids on saturated dark backgrounds
- **Hims** — Same pill-button system, full-bleed dark product sections with white text, and botanical/clinical brand positioning expressed through restrained color use

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-forest-depths: #1c3a13;
  --color-lime-pulse: #d3fa99;
  --color-sage-moss: #757c5d;
  --color-olive-gold: #9f995b;
  --color-eucalyptus: #698e79;
  --color-snow-white: #fcfcf7;
  --color-warm-stone: #eeeee9;
  --color-frosted-glass: #c4c7c4;
  --color-ash: #b3b3b3;
  --color-pewter: #666666;
  --color-ink: #000000;

  /* Typography — Font Families */
  --font-seed-sans: 'Seed Sans', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-seed-sans-mono: 'Seed Sans Mono', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;

  /* Typography — Scale */
  --text-micro: 10px;
  --leading-micro: 1;
  --text-label: 12px;
  --leading-label: 1.5;
  --text-caption: 14px;
  --leading-caption: 1.4;
  --text-body-sm: 16px;
  --leading-body-sm: 1.5;
  --text-body: 18px;
  --leading-body: 1.3;
  --tracking-body: -0.18px;
  --text-subheading: 24px;
  --leading-subheading: 1.2;
  --tracking-subheading: -0.48px;
  --text-heading-sm: 32px;
  --leading-heading-sm: 1.5;
  --text-heading: 36px;
  --leading-heading: 1;
  --text-heading-lg: 40px;
  --leading-heading-lg: 1.1;
  --tracking-heading-lg: -0.4px;
  --text-display: 48px;
  --leading-display: 1.1;
  --tracking-display: -0.72px;

  /* Typography — Weights */
  --font-weight-light: 300;
  --font-weight-w350: 350;
  --font-weight-regular: 400;
  --font-weight-medium: 500;

  /* Spacing */
  --spacing-unit: 8px;
  --spacing-8: 8px;
  --spacing-16: 16px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-40: 40px;
  --spacing-48: 48px;
  --spacing-56: 56px;
  --spacing-64: 64px;
  --spacing-80: 80px;
  --spacing-96: 96px;
  --spacing-128: 128px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 64px;
  --card-padding: 16px;
  --element-gap: 8px;

  /* Border Radius */
  --radius-md: 4px;
  --radius-lg: 8px;
  --radius-2xl: 16px;
  --radius-3xl: 32px;
  --radius-full: 1000px;
  --radius-full-2: 9999px;

  /* Named Radii */
  --radius-cards: 16px;
  --radius-badges: 1000px;
  --radius-inputs: 8px;
  --radius-buttons: 1000px;
  --radius-large-cards: 32px;

  /* Surfaces */
  --surface-page-canvas: #fcfcf7;
  --surface-card-surface: #eeeee9;
  --surface-dark-section: #1c3a13;
  --surface-accent-highlight: #d3fa99;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-forest-depths: #1c3a13;
  --color-lime-pulse: #d3fa99;
  --color-sage-moss: #757c5d;
  --color-olive-gold: #9f995b;
  --color-eucalyptus: #698e79;
  --color-snow-white: #fcfcf7;
  --color-warm-stone: #eeeee9;
  --color-frosted-glass: #c4c7c4;
  --color-ash: #b3b3b3;
  --color-pewter: #666666;
  --color-ink: #000000;

  /* Typography */
  --font-seed-sans: 'Seed Sans', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-seed-sans-mono: 'Seed Sans Mono', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;

  /* Typography — Scale */
  --text-micro: 10px;
  --leading-micro: 1;
  --text-label: 12px;
  --leading-label: 1.5;
  --text-caption: 14px;
  --leading-caption: 1.4;
  --text-body-sm: 16px;
  --leading-body-sm: 1.5;
  --text-body: 18px;
  --leading-body: 1.3;
  --tracking-body: -0.18px;
  --text-subheading: 24px;
  --leading-subheading: 1.2;
  --tracking-subheading: -0.48px;
  --text-heading-sm: 32px;
  --leading-heading-sm: 1.5;
  --text-heading: 36px;
  --leading-heading: 1;
  --text-heading-lg: 40px;
  --leading-heading-lg: 1.1;
  --tracking-heading-lg: -0.4px;
  --text-display: 48px;
  --leading-display: 1.1;
  --tracking-display: -0.72px;

  /* Spacing */
  --spacing-8: 8px;
  --spacing-16: 16px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-40: 40px;
  --spacing-48: 48px;
  --spacing-56: 56px;
  --spacing-64: 64px;
  --spacing-80: 80px;
  --spacing-96: 96px;
  --spacing-128: 128px;

  /* Border Radius */
  --radius-md: 4px;
  --radius-lg: 8px;
  --radius-2xl: 16px;
  --radius-3xl: 32px;
  --radius-full: 1000px;
  --radius-full-2: 9999px;
}
```
