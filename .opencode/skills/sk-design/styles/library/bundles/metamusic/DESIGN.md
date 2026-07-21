# MetaMusic — Style Reference
> editorial cream broadsheet with sticker-flat accents — a warm-paper canvas where oversized type and hard-offset shadows replace all decoration.

**Theme:** mixed

MetaMusic speaks in a paper-warm, editorial tone: a cream canvas (#f4f1ea) hosts oversized display headlines (up to 120px) that read like a museum wall label, while one vivid blue (#0066cc) and one deep indigo (#0e2575) carry all functional weight. Surfaces stack from cream → white → light-blue wash → indigo panel, creating a gentle warm-to-cool gradient as the eye scrolls. The defining texture is a hard 4px solid black offset shadow (zero blur) — a flat, almost sticker-like treatment that gives buttons and cards a tactile, printed feel rather than a soft Material elevation. Typography is monolinear and quiet: Maison Neue at every UI role, Spoof reserved for a single 22px accent heading, all set tight with negative tracking at display sizes. Components stay spacious (24px card radius, 40px internal padding) and never compete with the massive hero type; illustrated document and music icons float on warm peach circles as the only decorative voice.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Brand Blue | `#0066cc` | `--color-brand-blue` | Primary action background, link underlines, heading accents, card fills on light surfaces — the single chromatic voice that powers CTAs, active states, and iconography |
| Deep Indigo | `#0e2575` | `--color-deep-indigo` | Dark section backgrounds (feature/why panels), hero image frames — the only place a full-bleed surface goes deep and saturated |
| Midnight Card | `#213680` | `--color-midnight-card` | Elevated card surface when sitting on Deep Indigo backgrounds — one step lighter than the panel to separate without using shadow |
| Charcoal Ink | `#101820` | `--color-charcoal-ink` | Body text and dark-surface secondary fills — slightly cooler than pure black, anchors reading text without harshness |
| Paper Cream | `#f4f1ea` | `--color-paper-cream` | Primary page canvas — the warm base that gives the whole site its editorial, printed feel |
| White | `#ffffff` | `--color-white` | Card surfaces, nav background, button text on blue, input fills — the clean highlight layer above cream |
| Lavender Mist | `#e6e0f8` | `--color-lavender-mist` | Neutral form states, badge text, and quiet UI feedback where color should stay understated. Do not promote it to the primary CTA color |
| Ice Blue | `#e9f4ff` | `--color-ice-blue` | Alternate light surface wash, subtle card background variant — the cool counterpoint to Paper Cream |
| Peach Blush | `#f7e1d5` | `--color-peach-blush` | Icon circle backgrounds in audience/feature cards — the only warm accent that breaks the cream-on-cream |
| Ash Border | `#d6d6d6` | `--color-ash-border` | Hairline dividers, subtle borders on neutral surfaces — the quietest structural line |

## Tokens — Typography

### Maison Neue — The sole workhorse font across body, nav, headings, buttons, inputs, cards, and footers. Weight 400 carries body and UI labels; 500 steps up to subheadings and nav; 600 owns display sizes (56–120px). The type behaves like a neo-grotesque with humanist warmth — readable at 12px, monumental at 120px. Negative tracking tightens aggressively at display sizes (-0.03em at 120px, -0.02em at 56–80px, -0.01em at 32–40px) so headlines sit visually compact despite their scale. · `--font-maison-neue`
- **Substitute:** Inter, Söhne, or IBM Plex Sans
- **Weights:** 400, 500, 600
- **Sizes:** 12, 14, 16, 19, 22, 26, 32, 40, 56, 80, 120
- **Line height:** 0.95, 1.05, 1.10, 1.20, 1.35, 1.40, 1.50
- **Letter spacing:** -0.0300em, -0.0200em, -0.0100em
- **Role:** The sole workhorse font across body, nav, headings, buttons, inputs, cards, and footers. Weight 400 carries body and UI labels; 500 steps up to subheadings and nav; 600 owns display sizes (56–120px). The type behaves like a neo-grotesque with humanist warmth — readable at 12px, monumental at 120px. Negative tracking tightens aggressively at display sizes (-0.03em at 120px, -0.02em at 56–80px, -0.01em at 32–40px) so headlines sit visually compact despite their scale.

### Spoof — Reserved for a single accent heading or card label at 22px / weight 500. Its ultra-tight 0.90 leading and -0.02em tracking create a display-quality mark at a mid size — used as a typographic exclamation point, never as a workhorse. Free substitute: GT America or a tight condensed sans like Druk Wide. · `--font-spoof`
- **Substitute:** GT America, Druk Wide, or Söhne Breit
- **Weights:** 500
- **Sizes:** 22
- **Line height:** 0.90
- **Letter spacing:** -0.0200em
- **Role:** Reserved for a single accent heading or card label at 22px / weight 500. Its ultra-tight 0.90 leading and -0.02em tracking create a display-quality mark at a mid size — used as a typographic exclamation point, never as a workhorse. Free substitute: GT America or a tight condensed sans like Druk Wide.

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 12px | 1.5 | — | `--text-caption` |
| body-sm | 14px | 1.5 | — | `--text-body-sm` |
| body | 16px | 1.4 | — | `--text-body` |
| subheading | 19px | 1.4 | — | `--text-subheading` |
| heading-sm | 22px | 1.2 | -0.2px | `--text-heading-sm` |
| heading | 32px | 1.2 | -0.32px | `--text-heading` |
| heading-lg | 40px | 1.1 | -0.4px | `--text-heading-lg` |
| display-sm | 56px | 1.05 | -1.12px | `--text-display-sm` |
| display | 80px | 1.05 | -1.6px | `--text-display` |
| display-lg | 120px | 0.95 | -3.6px | `--text-display-lg` |

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
| 80 | 80px | `--spacing-80` |
| 88 | 88px | `--spacing-88` |
| 96 | 96px | `--spacing-96` |
| 120 | 120px | `--spacing-120` |
| 160 | 160px | `--spacing-160` |

### Border Radius

| Element | Value |
|---------|-------|
| nav | 8px |
| cards | 24px |
| badges | 9999px |
| inputs | 8px |
| buttons | 9999px |

### Shadows

| Name | Value | Token |
|------|-------|-------|
| subtle | `rgb(0, 0, 0) 0px 4px 0px 0px` | `--shadow-subtle` |

### Layout

- **Page max-width:** 1280px
- **Section gap:** 80px
- **Card padding:** 40px
- **Element gap:** 24px

## Components

### Display Headline
**Role:** Hero and section-opening text

Maison Neue weight 600, sizes 80–120px, lineHeight 0.95–1.05, letter-spacing -0.02em to -0.03em. Color: Charcoal Ink (#101820) on cream, White on indigo. Sets the editorial voice — monumental, tight, and unadorned.

### Section Heading
**Role:** Mid-page section titles

Maison Neue weight 600 at 56px, lineHeight 1.05, letter-spacing -0.02em. Color: Charcoal Ink on cream surfaces, White on indigo. The 56px step is the most repeated display size across interior sections.

### Accent Eyebrow Label
**Role:** Small blue label above section headings

Maison Neue weight 500 at 16–19px, color Brand Blue (#0066cc), no uppercase. Acts as the 'Discover MetaMusic' / 'Who's it for?' pre-title — a short functional punctuation that introduces each section.

### Primary CTA Button
**Role:** Filled blue action button

Background Brand Blue (#0066cc), text White, Maison Neue weight 500 at 16px, padding 16px 24px, border-radius 9999px (pill), hard 4px black offset shadow. One per view maximum.

### Outline Nav Button
**Role:** Log-in / portal entry in header

White background, Black 1px border, Charcoal Ink text, Maison Neue weight 500 at 16px, padding 12px 24px, border-radius 9999px, hard 4px black offset shadow. The only outlined pill in the system — sits in the header as a secondary entry point.

### Ghost Arrow Button
**Role:** Card continuation control

Circular 40px Black (#000000) background, White right-arrow icon, no border, no shadow. Sits in the bottom-right corner of feature cards to signal 'continue' without a full CTA treatment.

### Feature Card on Indigo
**Role:** Numbered step card in dark sections

Background Midnight Card (#213680), padding 40px, border-radius 24px, no shadow. Top-left has a 32px Brand Blue circle with white numeral. Title: White Maison Neue weight 500 at 22px. Body: White at 16px.

### Audience Card
**Role:** Audience / "who's it for" card

Background White, padding 40px, border-radius 24px, no shadow. Left side: 48px Peach Blush (#f7e1d5) circle with Brand Blue line-icon. Right: Charcoal Ink title (Maison Neue 500, 19px) and body (16px, 400).

### Text Input
**Role:** Form fields

Background White, border 1px Lavender Mist (#e6e0f8), border-radius 8px, padding 16px, Maison Neue 400 at 16px. Focus: border becomes Brand Blue. No floating labels.

### Notification Banner
**Role:** Top-of-page announcement bar

Background Lavender Mist (#e6e0f8), full-width, padding 8px, Charcoal Ink text at 12–14px, small close × on the right. The only persistent banner in the system.

### Illustration Icon Circle
**Role:** Decorative music/document icon

48–64px Peach Blush (#f7e1d5) circle with a Brand Blue line-art icon inside (document, magnifying glass, music note). Always paired with or floats near headlines; never used as a functional control.

### Top Navigation Bar
**Role:** Primary site navigation

White background, 64px height, Maison Neue weight 500 at 16px for links. Logo (Maison Neue wordmark + mark) on the left, links centered/left-aligned, Outline Nav Button on the right. Bottom hairline border in Ash Border (#d6d6d6).

### Language/Region Toggle
**Role:** Globe icon with language code in header

No background, Charcoal Ink globe icon + 2-letter language code at 14px, right-aligned in nav. Minimal — never wrapped in a button chrome.

## Do's and Don'ts

### Do
- Use Maison Neue for all UI text; reserve Spoof for one accent heading at 22px per page maximum
- Apply the hard 4px black offset shadow only to interactive controls (buttons, nav items) — never to cards or images
- Stack the surface system in order: Paper Cream canvas → White card → Ice Blue wash → Midnight Card on Deep Indigo; never mix more than two surface levels in one viewport
- Set display headlines at 80–120px with letter-spacing -0.02em to -0.03em; the tight tracking is what makes the oversized type feel intentional rather than bloated
- Use the 24px radius for all cards and the 9999px pill for all buttons and tags; 8px is reserved for inputs only
- Place Peach Blush icon circles only inside audience/feature cards — never on dark indigo surfaces where they would clash
- Use Card Padding 40px and Section Gap 80px as the rhythm; the 8px base unit governs all internal gaps

### Don't
- Do not use soft, blurred drop shadows — the hard 4px solid offset is the only elevation language in this system
- Do not introduce new chromatic colors; Brand Blue and Deep Indigo are the only saturated voices, and they must not share a surface
- Do not set display type without negative letter-spacing; positive tracking at 56px+ destroys the editorial feel
- Do not use 8px radius on cards or 24px radius on inputs — the three-tier radius system (24px / 9999px / 8px) is strict
- Do not place text directly on Peach Blush or Lavender Mist without checking contrast — both are surface washes, not text backgrounds
- Do not add a second outlined pill button to the same view; the Log-in outline is a one-per-header accent
- Do not center body text longer than a single line; the editorial system relies on left-aligned, ragged-right reading

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Paper Cream Canvas | `#f4f1ea` | Primary page background — the warm editorial base |
| 1 | White Card | `#ffffff` | Standard card and nav surface on cream canvas |
| 2 | Ice Blue Wash | `#e9f4ff` | Alternate light surface for secondary cards and callout boxes |
| 3 | Lavender Mist | `#e6e0f8` | Input field backgrounds, notification banner tint |
| 4 | Peach Blush | `#f7e1d5` | Icon circle containers in feature/audience cards |
| 5 | Midnight Card | `#213680` | Elevated card on deep indigo panels |
| 6 | Deep Indigo Panel | `#0e2575` | Full-bleed dark feature section background |

## Elevation

- **Buttons, nav buttons, pill controls:** `0px 4px 0px 0px #000000`

## Imagery

Visuals are illustrations, not photography — flat, line-art icons drawn in Brand Blue (#0066cc) depicting documents, magnifying glasses, music notes, cassette tapes, and microphones. Icons always sit inside Peach Blush (#f7e1d5) circles on cream surfaces, or float freely near headlines in the hero. The illustration style is geometric and monoweight, never filled, never gradient-shaded. No product screenshots, no lifestyle photography, no 3D renders. Image density is low — illustrations appear as single accents (one per hero, one per card) rather than as galleries. The visual language reads like editorial spot illustrations in a music-industry magazine.

## Layout

The page model is max-width contained at ~1280px, centered, with generous outer gutters. The hero is a left-aligned oversized headline stack on Paper Cream with floating illustration accents to the right — no full-bleed image, no video. The site alternates between warm cream bands (audience, features) and a single full-width Deep Indigo section ('Why use MetaMusic?'), creating a clear warm→cool progression as the user scrolls. Section rhythm uses 80px vertical gaps with no visible dividers — separation comes from surface color shifts alone. The audience section uses a 2-column split: oversized left-aligned heading on the left, stacked white cards on the right. Feature sections use a 3–4 column card grid on the dark indigo panel. Navigation is a single 64px white top bar — no sticky variant, no sidebar, no mega-menu. The overall density is spacious and editorial: one or two primary elements per viewport, never more.

## Agent Prompt Guide

Quick Color Reference:
- Text: #101820 (Charcoal Ink) on cream, #ffffff on indigo
- Background: #f4f1ea (Paper Cream) for pages, #0e2575 (Deep Indigo) for dark sections
- Border: #d6d6d6 (Ash) for hairlines, #0066cc (Brand Blue) for interactive borders
- Accent: #0066cc (Brand Blue) — the only chromatic voice
- Icon wash: #f7e1d5 (Peach Blush) circles for decorative icons
- primary action: #0066cc (outlined action border)

Example Component Prompts:

1. Create a hero section: Paper Cream (#f4f1ea) background, max-width 1280px centered. Accent eyebrow 'Discover MetaMusic' in Brand Blue (#0066cc) Maison Neue 500 at 16px. Headline 'Take control of your music metadata' in Charcoal Ink (#101820) Maison Neue 600 at 80px, lineHeight 1.05, letter-spacing -1.6px. Two cards below at 40px padding, 24px radius: left card is Brand Blue (#0066cc) background with white text 'Create a MetaMusic Beta account' plus a 40px Black circular arrow button; right card is White background with 1px Ash Border, Charcoal Ink text, same arrow button.

2. Create an audience section: Paper Cream background, 2-column layout. Left column: Accent eyebrow 'Who's it for?' in Brand Blue 16px, then 'MetaMusic is for everyone involved in local music!' in Charcoal Ink Maison Neue 600 at 56px, lineHeight 1.05, letter-spacing -1.12px. Right column: 4 stacked White cards, each 40px padding, 24px radius, containing a 48px Peach Blush (#f7e1d5) circle with a Brand Blue line-icon, a 19px Maison Neue 500 title, and 16px body text.

3. Create a dark feature section: Deep Indigo (#0e2575) full-width background, white text. Centered heading 'Why use MetaMusic?' in White Maison Neue 600 at 56px, with a Brand Blue link 'Discover MetaMusic's metadata management tool →' below. 4-column grid of Midnight Card (#213680) cards, 40px padding, 24px radius. Each card has a 32px Brand Blue circle with a white numeral (1–4) top-left, a White Maison Neue 500 title at 22px, and White body at 16px.

4. Create a text input: White background, 1px Lavender Mist (#e6e0f8) border, 8px radius, 16px padding, Maison Neue 400 at 16px, Charcoal Ink text. Focus state: border becomes Brand Blue (#0066cc), no shadow change.

5. Create the top navigation: White background, 64px height, Ash Border (#d6d6d6) 1px bottom hairline. Left: Brand Blue mark + Maison Neue 600 wordmark. Center-left: nav links (Discover the Tool, Help and training sessions, Resources, News, Contact us) in Maison Neue 500 at 16px Charcoal Ink. Right: Outline Nav Button — White background, 1px Black border, Charcoal Ink 'Log-in to the portal' text, 9999px radius, 12px 24px padding, 0px 4px 0px 0px #000000 shadow. Far right: globe icon + 'Fr' in Maison Neue 400 at 14px.

## Typography Voice

Maison Neue is the entire voice of the interface — it carries from 12px helper text to 120px hero without ever changing its humanist character. The signature move is the negative letter-spacing ramp: -0.01em at 32–40px, -0.02em at 56–80px, -0.03em at 120px. This tracking compression is what makes the display type feel designed rather than defaulted. Spoof appears once per page maximum at 22px weight 500 — think of it as a typographic period at the end of a headline, not a body face. Never set body text at 0.90 line-height or display text at 1.5; the line-height scale is tightly coupled to size (0.95 at 120px → 1.5 at 12px).

## Similar Brands

- **Splice** — Editorial cream/white canvas with oversized sans-serif headlines and a single blue brand accent; the same museum-label approach to hero typography
- **Bandcamp** — Warm paper-like base color with generous spacing, large confident type, and minimal decoration — music-industry tools that prioritize readability over flash
- **Notion** — Clean light surfaces, generous card padding (40px), 24px card radius, and a single functional accent color for actions and links
- **Linear** — Pill-shaped buttons with hard-offset shadows and a single chromatic accent on a near-white canvas — the same sticker-flat button treatment
- **Squarespace** — Oversized display type with tight negative tracking, generous section gaps, and a warm neutral canvas that signals editorial credibility

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-brand-blue: #0066cc;
  --color-deep-indigo: #0e2575;
  --color-midnight-card: #213680;
  --color-charcoal-ink: #101820;
  --color-paper-cream: #f4f1ea;
  --color-white: #ffffff;
  --color-lavender-mist: #e6e0f8;
  --color-ice-blue: #e9f4ff;
  --color-peach-blush: #f7e1d5;
  --color-ash-border: #d6d6d6;

  /* Typography — Font Families */
  --font-maison-neue: 'Maison Neue', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-spoof: 'Spoof', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.5;
  --text-body-sm: 14px;
  --leading-body-sm: 1.5;
  --text-body: 16px;
  --leading-body: 1.4;
  --text-subheading: 19px;
  --leading-subheading: 1.4;
  --text-heading-sm: 22px;
  --leading-heading-sm: 1.2;
  --tracking-heading-sm: -0.2px;
  --text-heading: 32px;
  --leading-heading: 1.2;
  --tracking-heading: -0.32px;
  --text-heading-lg: 40px;
  --leading-heading-lg: 1.1;
  --tracking-heading-lg: -0.4px;
  --text-display-sm: 56px;
  --leading-display-sm: 1.05;
  --tracking-display-sm: -1.12px;
  --text-display: 80px;
  --leading-display: 1.05;
  --tracking-display: -1.6px;
  --text-display-lg: 120px;
  --leading-display-lg: 0.95;
  --tracking-display-lg: -3.6px;

  /* Typography — Weights */
  --font-weight-regular: 400;
  --font-weight-medium: 500;
  --font-weight-semibold: 600;

  /* Spacing */
  --spacing-unit: 8px;
  --spacing-8: 8px;
  --spacing-16: 16px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-40: 40px;
  --spacing-48: 48px;
  --spacing-80: 80px;
  --spacing-88: 88px;
  --spacing-96: 96px;
  --spacing-120: 120px;
  --spacing-160: 160px;

  /* Layout */
  --page-max-width: 1280px;
  --section-gap: 80px;
  --card-padding: 40px;
  --element-gap: 24px;

  /* Border Radius */
  --radius-lg: 8px;
  --radius-2xl: 16px;
  --radius-3xl: 24px;
  --radius-3xl-2: 36px;
  --radius-full: 9999px;

  /* Named Radii */
  --radius-nav: 8px;
  --radius-cards: 24px;
  --radius-badges: 9999px;
  --radius-inputs: 8px;
  --radius-buttons: 9999px;

  /* Shadows */
  --shadow-subtle: rgb(0, 0, 0) 0px 4px 0px 0px;

  /* Surfaces */
  --surface-paper-cream-canvas: #f4f1ea;
  --surface-white-card: #ffffff;
  --surface-ice-blue-wash: #e9f4ff;
  --surface-lavender-mist: #e6e0f8;
  --surface-peach-blush: #f7e1d5;
  --surface-midnight-card: #213680;
  --surface-deep-indigo-panel: #0e2575;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-brand-blue: #0066cc;
  --color-deep-indigo: #0e2575;
  --color-midnight-card: #213680;
  --color-charcoal-ink: #101820;
  --color-paper-cream: #f4f1ea;
  --color-white: #ffffff;
  --color-lavender-mist: #e6e0f8;
  --color-ice-blue: #e9f4ff;
  --color-peach-blush: #f7e1d5;
  --color-ash-border: #d6d6d6;

  /* Typography */
  --font-maison-neue: 'Maison Neue', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-spoof: 'Spoof', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.5;
  --text-body-sm: 14px;
  --leading-body-sm: 1.5;
  --text-body: 16px;
  --leading-body: 1.4;
  --text-subheading: 19px;
  --leading-subheading: 1.4;
  --text-heading-sm: 22px;
  --leading-heading-sm: 1.2;
  --tracking-heading-sm: -0.2px;
  --text-heading: 32px;
  --leading-heading: 1.2;
  --tracking-heading: -0.32px;
  --text-heading-lg: 40px;
  --leading-heading-lg: 1.1;
  --tracking-heading-lg: -0.4px;
  --text-display-sm: 56px;
  --leading-display-sm: 1.05;
  --tracking-display-sm: -1.12px;
  --text-display: 80px;
  --leading-display: 1.05;
  --tracking-display: -1.6px;
  --text-display-lg: 120px;
  --leading-display-lg: 0.95;
  --tracking-display-lg: -3.6px;

  /* Spacing */
  --spacing-8: 8px;
  --spacing-16: 16px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-40: 40px;
  --spacing-48: 48px;
  --spacing-80: 80px;
  --spacing-88: 88px;
  --spacing-96: 96px;
  --spacing-120: 120px;
  --spacing-160: 160px;

  /* Border Radius */
  --radius-lg: 8px;
  --radius-2xl: 16px;
  --radius-3xl: 24px;
  --radius-3xl-2: 36px;
  --radius-full: 9999px;

  /* Shadows */
  --shadow-subtle: rgb(0, 0, 0) 0px 4px 0px 0px;
}
```
