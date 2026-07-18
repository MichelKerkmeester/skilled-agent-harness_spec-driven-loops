# Repeat — Style Reference
> Highlighter swipe on warm notebook paper — Repeat's lime washes act like marker strokes across cream stock, with near-black ink and pill-rounded cards floating flat above.

**Theme:** light

Repeat uses an editorial highlighter-on-paper language: a vivid lime wash dominates the canvas like a marker swipe, a warm cream ground reads as notebook stock, and a single near-black ink carries every word of authority. Typography is assertive and uppercase — Poppins at heavy weight sets section titles in tight 1.2 line-height stacks, while Montserrat runs the body in a calm 17px — the contrast between shouting headlines and conversational body is the visual rhythm. Components are flat, generously rounded at 25px, and rely on thin black borders rather than shadows; even the CTA is a near-flat white card with a hairline border sitting on the lime. The single lime accent should be used sparingly as full-bleed section punctuation, never as a button fill or text color — color here is atmosphere, not chrome.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Ink | `#171717` | `--color-ink` | Dark borders and separators for elevated surfaces and inverted UI. Do not promote it to the primary CTA color |
| Paper | `#ffffff` | `--color-paper` | Hairline borders, dividers, input outlines, and card edges on light surfaces. Do not promote it to the primary CTA color |
| Notebook Cream | `#ede7e2` | `--color-notebook-cream` | Page canvas for body sections, feature row backgrounds — warm off-white that softens white cards and reads as paper stock |
| Olive Ink | `#37352f` | `--color-olive-ink` | Secondary near-black surface — warmer than Ink, used as a fill on the logo grid tiles and nav background accent |
| Highlight Lime | `#f5ff7d` | `--color-highlight-lime` | Hero section background, full-bleed color punctuation — the single saturated surface color; never use for text, borders, or buttons |
| Lavender Wash | `#e2d8ff` | `--color-lavender-wash` | Accent section background — soft violet surface for variety beats between white and lime sections |
| Periwinkle Wash | `#c3d5fc` | `--color-periwinkle-wash` | Accent section background — cool blue surface paired with Lavender Wash for tonal variety in content sections |

## Tokens — Typography

### Poppins — Display and section headings — used uppercase at 600 weight, tight 1.20 line-height creates an editorial stack; substitute: Montserrat or Inter at the same weights · `--font-poppins`
- **Weights:** 400, 500, 600
- **Sizes:** 17px, 20px, 24px, 29px, 37px
- **Line height:** 1.00–1.30
- **Letter spacing:** normal
- **Role:** Display and section headings — used uppercase at 600 weight, tight 1.20 line-height creates an editorial stack; substitute: Montserrat or Inter at the same weights

### Montserrat — Body, navigation, links, card text, captions, footer — the workhorse; 17px at 400 weight is the default reading size with comfortable 1.50 leading; substitute: Inter or DM Sans · `--font-montserrat`
- **Weights:** 400, 500, 600
- **Sizes:** 13px, 15px, 17px, 34px
- **Line height:** 0.75–2.00
- **Letter spacing:** normal
- **Role:** Body, navigation, links, card text, captions, footer — the workhorse; 17px at 400 weight is the default reading size with comfortable 1.50 leading; substitute: Inter or DM Sans

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 13px | 1.5 | — | `--text-caption` |
| body-sm | 15px | 1.6 | — | `--text-body-sm` |
| body | 17px | 1.5 | — | `--text-body` |
| subheading | 20px | 1.3 | — | `--text-subheading` |
| heading-sm | 24px | 1.2 | — | `--text-heading-sm` |
| heading | 29px | 1.2 | — | `--text-heading` |
| heading-lg | 34px | 1.2 | — | `--text-heading-lg` |
| display | 37px | 1.2 | — | `--text-display` |

## Tokens — Spacing & Shapes

**Base unit:** 4px

**Density:** compact

### Spacing Scale

| Name | Value | Token |
|------|-------|-------|
| 4 | 4px | `--spacing-4` |
| 8 | 8px | `--spacing-8` |
| 12 | 12px | `--spacing-12` |
| 16 | 16px | `--spacing-16` |
| 24 | 24px | `--spacing-24` |
| 40 | 40px | `--spacing-40` |
| 48 | 48px | `--spacing-48` |
| 96 | 96px | `--spacing-96` |

### Border Radius

| Element | Value |
|---------|-------|
| nav | 8px |
| cards | 25px |
| icons | 3px |
| images | 20px |
| buttons | 100px |
| heroCard | 25px |

### Shadows

| Name | Value | Token |
|------|-------|-------|
| sm | `rgba(0, 0, 0, 0.01) 0px 4px 8px -2px` | `--shadow-sm` |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 40px
- **Card padding:** 15px
- **Element gap:** 4px

## Components

### Top Navigation Bar
**Role:** Global site navigation

Horizontal bar with Repeat wordmark left, product/blog links center, and a black 100px-radius pill CTA on the right. White or transparent background, sits above all hero sections. Nav links at 15px Montserrat 500, CTA at 15px Montserrat 600 white on Ink (#171717).

### Primary Filled CTA Button
**Role:** Primary action — demo request, signup

Black pill button at 100px border-radius, Ink (#171717) background, Paper (#ffffff) text, 15px Montserrat 600, ~12px 20px padding. Sits on white or cream surfaces only — never directly on the lime. The 

### Hero Lime Section
**Role:** Above-the-fold hero block

Full-bleed Highlight Lime (#f5ff7d) background. Headline at 37px Poppins 600 uppercase in Ink, tight 1.20 leading. Subhead at 17px Montserrat 400 in Ink. The white CTA card sits centered below, creating a card-on-color composition.

### Hero White CTA Card
**Role:** Primary action surface on the lime hero

Paper (#ffffff) rounded card, 25px radius, thin Ink (#171717) border at ~1px, generous internal padding (~40px vertical). Contains an arrow glyph and 

### Secondary Text Link
**Role:** Tertiary action — low-commitment next step

Underlined Montserrat 15px 400 in Ink, no background or border. Always paired below the primary CTA card. Example pattern: 

### Section Heading (Uppercase Poppins)
**Role:** Page section title

29–37px Poppins 600 uppercase in Ink, line-height 1.20, left-aligned. Optional Ink underline divider below. The signature editorial title style — uppercase + tight leading is what makes the design feel like a printed spread.

### Brand Product Card
**Role:** Customer showcase in social-proof section

25px-radius card containing a full-bleed product photograph on a solid colored background (teal, pink, cream). 20px image radius via overflow:hidden. No border, no shadow. Three-up grid. Image does the talking; the card is just a frame.

### Testimonial Stat Card
**Role:** Customer proof with metric headline

25px-radius white card with thin Ink border, 15px internal padding. Structure: product image on top (rounded), then stat in 17–20px Poppins 600 (e.g. 

### Logo Grid Tile
**Role:** Customer logo in social-proof strip

Olive Ink (#37352f) rounded square, 25–50px radius, 1:1 aspect ratio, containing the customer brand wordmark in Paper (#ffffff) at ~17px Montserrat 600 centered. Four-up row. No border, no shadow — the fill is the frame.

### Feature Row
**Role:** Product capability explanation with screenshot

Two-column layout on Notebook Cream (#ede7e2) background: text block left (headline + body + bullet list in 17px Montserrat), product screenshot right in a 20px-radius frame. Generous 40px vertical padding. Headline can be Poppins 600 uppercase or sentence-case at 24px.

### Footer
**Role:** Site footer

Paper or Notebook Cream background, multi-column link grid in 15px Montserrat 400 Ink, logo and copyright at bottom. Minimal — no heavy social icon blocks, no newsletter modal.

## Do's and Don'ts

### Do
- Use Highlight Lime (#f5ff7d) only as a full-bleed section background — never as text, border, or button fill
- Set all section titles in uppercase Poppins 600 at 29–37px with 1.20 line-height for the editorial headline stack
- Round all content cards at 25px — the 25px radius is the system fingerprint
- Pair the filled black pill CTA (Ink background, 100px radius) with the white CTA card on lime as the primary action pattern
- Use 1px Ink borders instead of shadows to separate cards from the canvas
- Switch section background colors (lime → cream → white → lavender) to create visual rhythm between content blocks
- Set body copy in Montserrat 400 at 17px with 1.50 leading — never below 15px
- Underline text links in Ink with no other decoration

### Don't
- Do not use Highlight Lime for text, borders, icons, or button fills — it is a surface color only
- Do not introduce colored buttons (blue, green, red) — actions are Ink-filled or Paper-outlined only
- Do not use shadows heavier than rgba(0,0,0,0.01) — the system is intentionally flat
- Do not mix in a third typeface — the system is strictly Poppins + Montserrat
- Do not use sharp corners on cards or images — 20–25px is the minimum radius for surfaces
- Do not place the primary CTA button directly on the lime background — wrap it in a white card first
- Do not use line-height looser than 1.30 on headings — the tight editorial stack is the signature
- Do not use gradients — Repeat is a flat-color system; the only tonal shifts are solid surface swaps

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Notebook Cream | `#ede7e2` | Page canvas for feature rows and body content |
| 1 | Paper | `#ffffff` | Card surfaces, hero CTA card, inverted sections |
| 2 | Highlight Lime | `#f5ff7d` | Hero full-bleed, section punctuation |
| 3 | Lavender Wash | `#e2d8ff` | Soft accent section background |
| 4 | Periwinkle Wash | `#c3d5fc` | Soft accent section background |

## Elevation

Repeat uses near-invisible shadows (rgba(0,0,0,0.01)) to create the faintest sense of card lift without visual noise. The system deliberately avoids heavy elevation: depth comes from full-bleed color section changes (white → lime → cream → lavender) rather than drop shadows. Cards separate from the canvas via 1px Ink borders or color contrast, never via shadow stacks. Do not introduce elevation levels beyond this whisper shadow.

## Imagery

Imagery is product-first photography shot against solid colored studio backgrounds — teal, pink, cream — with no lifestyle context or human models. The product IS the hero, framed inside 25px-radius cards. Product crops are tight, well-lit, high-key. No illustrations, no 3D renders, no abstract graphics. Iconography is minimal and outlined; brand logos in the customer strip are white wordmarks on dark tiles. The overall image-to-text ratio is image-light — photography serves as proof of customer success, not as decorative atmosphere. Color variety in imagery comes from the colored backdrops, not from filters or color grading.

## Layout

Page structure is full-bleed bands stacked vertically, each band owning one background color. The hero is a full-bleed lime band with a centered white CTA card. Below it, a white band holds a 3-column brand showcase grid. A second white band holds a 3-column testimonial grid, followed by a 4-up dark logo strip. Feature rows alternate on Notebook Cream with 2-column text-left/image-right splits. Section vertical rhythm is 40px internal padding with full-bleed color changes doing the work of section dividers. The grid system is a 3-column card grid for showcases and testimonials, and a 4-column grid for the logo strip. Navigation is a simple top bar — no sticky header, no sidebar, no mega-menu. Content density is compact but breathable; cards never touch, always separated by the canvas color.

## Agent Prompt Guide

**Quick Color Reference**\n- text: #171717 (Ink)\n- background: #ffffff (Paper) for cards, #ede7e2 (Notebook Cream) for canvas\n- border: #171717 (Ink) at 1px\n- accent surface: #f5ff7d (Highlight Lime) for full-bleed sections only\n- primary action: no distinct CTA color

## Similar Brands

- **Notion** — Same warm-neutral canvas (cream/white) with a single bold accent surface, flat components, thin borders instead of shadows, and uppercase headings carrying authority
- **Linear** — Editorial typography attitude — uppercase bold Poppins/Inter titles at tight line-height paired with calm body copy; monochromatic system with one accent color doing the work
- **Substack** — Notebook-paper warmth (cream canvas), near-black ink typography, and a single saturated color (their red, Repeat's lime) used as full-bleed section punctuation
- **Gumroad** — Bold pill CTAs (black filled), generous 25px+ card radii, flat elevation philosophy, and confident uppercase headlines over warm product photography

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-ink: #171717;
  --color-paper: #ffffff;
  --color-notebook-cream: #ede7e2;
  --color-olive-ink: #37352f;
  --color-highlight-lime: #f5ff7d;
  --color-lavender-wash: #e2d8ff;
  --color-periwinkle-wash: #c3d5fc;

  /* Typography — Font Families */
  --font-poppins: 'Poppins', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-montserrat: 'Montserrat', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 13px;
  --leading-caption: 1.5;
  --text-body-sm: 15px;
  --leading-body-sm: 1.6;
  --text-body: 17px;
  --leading-body: 1.5;
  --text-subheading: 20px;
  --leading-subheading: 1.3;
  --text-heading-sm: 24px;
  --leading-heading-sm: 1.2;
  --text-heading: 29px;
  --leading-heading: 1.2;
  --text-heading-lg: 34px;
  --leading-heading-lg: 1.2;
  --text-display: 37px;
  --leading-display: 1.2;

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
  --spacing-24: 24px;
  --spacing-40: 40px;
  --spacing-48: 48px;
  --spacing-96: 96px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 40px;
  --card-padding: 15px;
  --element-gap: 4px;

  /* Border Radius */
  --radius-sm: 3px;
  --radius-lg: 8px;
  --radius-2xl: 20px;
  --radius-3xl: 25px;
  --radius-full: 50px;
  --radius-full-2: 100px;

  /* Named Radii */
  --radius-nav: 8px;
  --radius-cards: 25px;
  --radius-icons: 3px;
  --radius-images: 20px;
  --radius-buttons: 100px;
  --radius-herocard: 25px;

  /* Shadows */
  --shadow-sm: rgba(0, 0, 0, 0.01) 0px 4px 8px -2px;

  /* Surfaces */
  --surface-notebook-cream: #ede7e2;
  --surface-paper: #ffffff;
  --surface-highlight-lime: #f5ff7d;
  --surface-lavender-wash: #e2d8ff;
  --surface-periwinkle-wash: #c3d5fc;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-ink: #171717;
  --color-paper: #ffffff;
  --color-notebook-cream: #ede7e2;
  --color-olive-ink: #37352f;
  --color-highlight-lime: #f5ff7d;
  --color-lavender-wash: #e2d8ff;
  --color-periwinkle-wash: #c3d5fc;

  /* Typography */
  --font-poppins: 'Poppins', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-montserrat: 'Montserrat', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 13px;
  --leading-caption: 1.5;
  --text-body-sm: 15px;
  --leading-body-sm: 1.6;
  --text-body: 17px;
  --leading-body: 1.5;
  --text-subheading: 20px;
  --leading-subheading: 1.3;
  --text-heading-sm: 24px;
  --leading-heading-sm: 1.2;
  --text-heading: 29px;
  --leading-heading: 1.2;
  --text-heading-lg: 34px;
  --leading-heading-lg: 1.2;
  --text-display: 37px;
  --leading-display: 1.2;

  /* Spacing */
  --spacing-4: 4px;
  --spacing-8: 8px;
  --spacing-12: 12px;
  --spacing-16: 16px;
  --spacing-24: 24px;
  --spacing-40: 40px;
  --spacing-48: 48px;
  --spacing-96: 96px;

  /* Border Radius */
  --radius-sm: 3px;
  --radius-lg: 8px;
  --radius-2xl: 20px;
  --radius-3xl: 25px;
  --radius-full: 50px;
  --radius-full-2: 100px;

  /* Shadows */
  --shadow-sm: rgba(0, 0, 0, 0.01) 0px 4px 8px -2px;
}
```
