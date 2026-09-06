# Faire ES — Style Reference
> warm cream wholesale catalog

**Theme:** light

Faire reads like a printed wholesale catalog digitized — warm cream paper (#fbf8f6) as the canvas, a whisper-thin geometric sans (Graphik 100) for body and a high-contrast serif (Nantes) for editorial headlines, almost zero chromatic noise, and one pale buttery yellow (#f1f29f) used as a decorative underline accent rather than a functional call-to-action. The whole interface is achromatic: the brand 'Sign up to buy' button is matte black, the secondary 'Sign in' is ghost, category nav pills use a generous 40px radius, and the 4px button radius keeps control elements grounded and rectangular against the otherwise pill-shaped navigation. Imagery carries all the warmth — full-bleed lifestyle photography of boutiques, shelves, and product stills — while the UI stays quiet, editorial, and whitespace-driven, letting merchants' products feel curated rather than marketed.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Cream Paper | `#fbf8f6` | `--color-cream-paper` | Page canvas, hero backgrounds, warm base layer beneath white cards |
| Pure White | `#ffffff` | `--color-pure-white` | Card surfaces, search field background, raised panels, inverted text on dark buttons |
| Ink Black | `#000000` | `--color-ink-black` | Dark borders and separators for elevated surfaces and inverted UI. Do not promote it to the primary CTA color |
| Charcoal | `#333333` | `--color-charcoal` | Secondary text, form field borders, body copy, inactive link text |
| Smoke | `#6c6a6a` | `--color-smoke` | Muted helper text, tertiary metadata, low-emphasis labels |
| Ash | `#dadada` | `--color-ash` | Divider lines, input borders, inactive card outlines, subtle separators between rows |
| Butter Highlight | `#f1f29f` | `--color-butter-highlight` | Yellow outline accent for tags, dividers, and focused UI edges. Do not promote it to the primary CTA color |

## Tokens — Typography

### Graphik — Primary UI and body sans-serif. Weight 100 at 22–30px carries display and feature headlines with an almost wireframe-thin feel — the opposite of SaaS-bold; this is editorial restraint. Weight 400 handles body, nav, buttons, and dense metadata. · `--font-graphik`
- **Substitute:** Inter (100, 400) or Manrope (200, 400) — the key is keeping the thin weight available at display sizes
- **Weights:** 100, 400
- **Sizes:** 14px, 16px, 18px, 22px, 28px, 30px
- **Line height:** 1.20–1.50
- **Letter spacing:** 0.0050em to 0.0110em — slight positive tracking that loosens as size shrinks, the opposite of most design systems
- **Role:** Primary UI and body sans-serif. Weight 100 at 22–30px carries display and feature headlines with an almost wireframe-thin feel — the opposite of SaaS-bold; this is editorial restraint. Weight 400 handles body, nav, buttons, and dense metadata.

### Nantes — Editorial serif for hero and section headlines. Tight leading (1.23 at 52px) lets the serifs do the work of personality. The contrast between a humanist serif headline and a near-weightless sans body is the site's most recognizable typographic gesture. · `--font-nantes`
- **Substitute:** GT Sectra, Source Serif Pro, or PT Serif at regular weight
- **Weights:** 400
- **Sizes:** 22px, 30px, 38px, 52px
- **Line height:** 1.23–1.45
- **Letter spacing:** normal (0)
- **Role:** Editorial serif for hero and section headlines. Tight leading (1.23 at 52px) lets the serifs do the work of personality. The contrast between a humanist serif headline and a near-weightless sans body is the site's most recognizable typographic gesture.

### Graphik (fix variant) — Corrected variant of Graphik used inside inputs, small buttons, and form elements where kerning fidelity matters most · `--font-graphik-fix-variant`
- **Substitute:** Same as primary Graphik — Inter 400
- **Weights:** 400
- **Sizes:** 14px, 16px
- **Line height:** 1.43, 1.50
- **Letter spacing:** 0.0090em to 0.0110em
- **Role:** Corrected variant of Graphik used inside inputs, small buttons, and form elements where kerning fidelity matters most

### Graphik_fix — Graphik_fix — detected in extracted data but not described by AI · `--font-graphikfix`
- **Weights:** 400
- **Sizes:** 14px, 16px
- **Line height:** 1.43, 1.5
- **Letter spacing:** 0.009, 0.011
- **Role:** Graphik_fix — detected in extracted data but not described by AI

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 14px | 1.5 | 0.154px | `--text-caption` |
| body | 16px | 1.5 | 0.144px | `--text-body` |
| subheading | 18px | 1.44 | 0.09px | `--text-subheading` |
| heading-sm | 22px | 1.45 | 0.11px | `--text-heading-sm` |
| heading | 28px | 1.43 | 0.14px | `--text-heading` |
| heading-lg | 30px | 1.27 | 0.24px | `--text-heading-lg` |
| display | 52px | 1.23 | — | `--text-display` |

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
| 48 | 48px | `--spacing-48` |
| 56 | 56px | `--spacing-56` |

### Border Radius

| Element | Value |
|---------|-------|
| cards | 4px |
| badges | 40px |
| images | 4px |
| inputs | 4px |
| buttons | 4px |
| navPills | 40px |
| categoryChips | 40px |

### Layout

- **Page max-width:** 1280px
- **Section gap:** 48-64px
- **Card padding:** 16px
- **Element gap:** 16px

## Components

### Primary CTA Button (Sign up to buy)
**Role:** Main conversion action — dark filled button

Background #000000, text #ffffff, 4px radius, horizontal padding 23px, vertical padding 8–12px. Graphik 400 at 14–16px, letter-spacing 0.0090em. The matte-black fill against cream paper is the page's only high-chromatic-weight element, so it reads as deliberate and confident rather than aggressive.

### Ghost Text Button (Sign in)
**Role:** Secondary action that recedes

No fill, no border. Text in #000000 at 14–16px Graphik 400, letter-spacing 0.0090em. Sits inline with navigation as a quiet alternative to the filled CTA.

### Hero Search Bar
**Role:** Primary discovery input anchored in the header

Pill-shaped (40px radius), white #ffffff background, 1px solid #dadada border, padding 16px horizontal. Search icon left, placeholder text in #333333 at 16px Graphik 400. The pill shape is the only non-rectangular control on the page, making it instantly identifiable as the search field.

### Category Nav Pills
**Role:** Horizontal category filter row above featured brand grid

40px radius, 16px vertical / 23px horizontal padding, 1px border. Default state: white #ffffff background, #333333 border, #000000 text. Active/selected state: #000000 background, #ffffff text. Pills sit in a horizontally scrollable row with 12px gaps.

### Top Category Nav Bar
**Role:** Primary site navigation row

Centered text-only links on cream #fbf8f6 background, no background or border. Items: Featured, New, Home decor, Food & drink, Women, Beauty & wellness, Jewelry, Paper & novelty, Kids & baby, Pets, Men, Books. 12–16px gap between items. Graphik 400 at 14px, color #000000.

### Brand Logo Card
**Role:** Square tile in the featured brands grid

Square or near-square thumbnail, 4px radius, 1px solid #dadada border, 4px padding. The product photography fills the card; the card itself is just a thin frame.

### Promo Banner (Top Bar)
**Role:** Slim announcement strip above the main header

Full-width, centered text 'Shop wholesale online from over 100,000 brands.' at 14px Graphik 400 in #000000 on cream #fbf8f6. The 'Sign up' link is underlined inline. No background fill — just a thin line of type at the top of the page.

### Hero Overlay Headline
**Role:** Large editorial title sitting over full-bleed photography

Nantes 400 at 38–52px, white #ffffff, line-height 1.23, no tracking. Headline sits bottom-left over the hero image with 48px left padding. A short 3-word yellow underline (#f1f29f) appears beneath the headline — this is the only place the accent color touches the hero.

### Section Heading with Yellow Accent Rule
**Role:** Reusable section title treatment used across the page

A 3px-tall #f1f29f horizontal line, 4px wide, sits above or below a Nantes 400 heading. The rule is decorative — it does not span the full heading width, it is a short editorial mark.

### Inverted Dark Section
**Role:** Full-width band that flips the page to a dark mode mid-scroll

Background is a deep desaturated green/charcoal. Text in white #ffffff, Nantes 400 at 30–38px. The contrast against the cream sections above and below creates a clear content break. Used for value-prop blocks like 'Get your products in front of millions of buyers'.

### Header Logo Wordmark
**Role:** Brand identifier top-left

FAIRE set in Graphik 400 (or a wide-tracked geometric sans) with significant positive letter-spacing, #000000. The generous tracking is the wordmark's only typographic treatment — no icon, no case styling.

## Do's and Don'ts

### Do
- Use the cream #fbf8f6 canvas as the page background, never pure white — the warm tone is part of the brand identity
- Set all body and UI text in Graphik 400 with letter-spacing between 0.0090em and 0.0110em
- Use Nantes 400 (or a humanist serif substitute) for editorial headlines at 30px and above, with tight 1.23–1.27 line-height
- Give all category nav, filter chips, and tag elements a 40px border-radius pill shape
- Keep all buttons, inputs, and cards at 4px border-radius
- Use the matte black #000000 fill for the single primary CTA on any given screen — never introduce a chromatic button color
- Use #f1f29f only as a short 3px decorative underline beneath a heading; never as a background, border, or text color

### Don't
- Do not use drop shadows or blur effects on any component — depth comes from section color transitions, not elevation
- Do not add a chromatic primary action color (green, red, blue) — the entire interactive system stays achromatic
- Do not bold the Graphik headlines — the signature is weight 100 or 400 only; authority comes from the serif, not from sans-serif heaviness
- Do not use the yellow #f1f29f on buttons, badges, or alerts — it is an editorial accent, not a functional state color
- Do not use rounded corners larger than 40px or smaller than 4px — the system has exactly two radii
- Do not introduce gradients — the page is flat-color throughout, including the hero overlay
- Do not use centered text in body or navigation contexts — the site reads left-aligned with editorial asymmetry

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Page Canvas | `#fbf8f6` | Warm cream background across the entire page; primary canvas tone |
| 1 | Card Surface | `#ffffff` | White product cards, elevated panels, search input field, pill chips |
| 2 | Elevated Overlay | `#ffffff` | Modals, dropdowns, sticky header bar; same white as cards but visually stacked via thin 1px borders |

## Elevation

- **Header search bar:** `none — relies on 1px #dadada border for definition`
- **Category nav pills:** `none — flat with 1px border`
- **Brand logo cards:** `none — flat with 1px #dadada border`
- **Primary CTA button:** `none — matte black fill carries the weight`

## Imagery

Full-bleed lifestyle and product photography carries all visual warmth. The hero uses a candid documentary shot of a woman in a boutique — green shelving, curated products, warm natural light — that establishes the brand's merchant-world identity. Product close-ups in the featured brands grid are square, tightly cropped, and fill their card edge-to-edge. No illustration, no 3D renders, no abstract graphics. Color treatment is natural and slightly desaturated to harmonize with the cream canvas; no duotone or filters. Photography is the only source of saturated color on the page.

## Layout

Max-width ~1280px centered container with generous side padding (48px). The hero is full-bleed with the text container left-aligned inside the max-width. Below the hero, sections alternate between cream #fbf8f6 canvas and occasional dark green inverted bands, each separated by 48–64px vertical rhythm. The featured brands section uses a category pill row followed by a horizontal product image grid (roughly 4–5 cards visible per row). Navigation is a two-tier top system: a slim promo banner, then a primary header with logo + search + utility actions, then a centered category text nav. The page is spacious and editorial — high white space ratio, no multi-column dense layouts, no sidebars. Asymmetric compositions (large left-aligned headline over image) rather than centered stacks.

## Agent Prompt Guide

**Quick Color Reference**
- text: #000000
- background: #fbf8f6
- surface: #ffffff
- border: #dadada
- secondary text: #333333
- muted text: #6c6a6a
- accent: #f1f29f (decorative only)
- primary action: no distinct CTA color

**Example Component Prompts**

1. *Hero section*: Cream #fbf8f6 base. Full-bleed lifestyle photo background. Bottom-left headline at 52px Nantes 400, white #ffffff, line-height 1.23. Short 3px-tall #f1f29f underline beneath the headline (decorative, not full-width). Subtext 18px Graphik 400, white. Ghost button with white border and white text, 4px radius, 16px 23px padding.

2. *Category filter row*: Cream #fbf8f6 background. Horizontal row of 40px-radius pills, 16px vertical / 23px horizontal padding, 12px gap between. Default: white #ffffff fill, 1px #333333 border, #000000 text. Active: #000000 fill, #ffffff text. 14px Graphik 400, letter-spacing 0.0090em.

3. *Featured brand card grid*: 4-column grid on 1280px max-width container. Each card: square aspect ratio, 4px radius, 4px padding, 1px #dadada border, edge-to-edge product photo. No shadow, no text overlay on the card itself.

4. *Inverted dark value-prop section*: Full-width dark desaturated green background. Nantes 400 headline at 38px white #ffffff, line-height 1.27. Inline text link in #f1f29f underline treatment (not a button). 48px vertical padding top and bottom, 48px horizontal padding within the 1280px max-width.

5. *Header with search*: 16px vertical padding row. FAIRE wordmark top-left in Graphik 400 with wide tracking. Center: 40px-radius white #ffffff search field with 1px #dadada border, search icon left, 16px Graphik 400 placeholder in #333333. Right: ghost 'Sign up to sell' and 'Sign in' text links, then a 4px-radius matte-black #000000 'Sign up to buy' button with 8px 23px padding and 14px Graphik 400 white text.

## Type Personality

The defining typographic gesture is the contrast between Nantes (a humanist editorial serif at regular weight) for display and Graphik at weight 100 for UI. This pairing rejects both the SaaS-bold sans convention and the e-commerce-display-serif convention — the serif is used to feel like a magazine masthead, the thin sans to feel like a quiet label. Letter-spacing on Graphik is slightly positive (0.005–0.011em) and increases as the size shrinks, which is the opposite of most systems where display type is tracked tight and body type is left normal. This gives small text a slightly airy, typeset quality.

## Radius System

Only two radii exist: 4px for everything rectangular (buttons, inputs, cards, images) and 40px for everything pill-shaped (search, category chips, tag pills, badges). There is no in-between. This binary is intentional — it keeps the page feeling catalog-precise while reserving pill shapes exclusively for navigational and filterable elements, making them instantly identifiable as interactive filters.

## Similar Brands

- **GOOP** — Same warm cream canvas with achromatic UI and editorial serif headlines over product photography
- **Net-a-Porter** — Same high-fashion catalog feel with generous whitespace, thin sans body type, and full-bleed lifestyle photography as the dominant visual element
- **Mejuri** — Same minimal achromatic UI with a single warm accent and editorial-style typography mixed with geometric sans
- **Anthropologie** — Same boutique-merchant identity expressed through full-bleed shop photography, warm neutrals, and serif/sans typographic pairing
- **Shopify (marketplace sections)** — Same clean B2B header pattern with a centered pill-shaped search bar, matte-black primary CTA, and ghost text links for secondary actions

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-cream-paper: #fbf8f6;
  --color-pure-white: #ffffff;
  --color-ink-black: #000000;
  --color-charcoal: #333333;
  --color-smoke: #6c6a6a;
  --color-ash: #dadada;
  --color-butter-highlight: #f1f29f;

  /* Typography — Font Families */
  --font-graphik: 'Graphik', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-nantes: 'Nantes', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-graphik-fix-variant: 'Graphik (fix variant)', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-graphikfix: 'Graphik_fix', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 14px;
  --leading-caption: 1.5;
  --tracking-caption: 0.154px;
  --text-body: 16px;
  --leading-body: 1.5;
  --tracking-body: 0.144px;
  --text-subheading: 18px;
  --leading-subheading: 1.44;
  --tracking-subheading: 0.09px;
  --text-heading-sm: 22px;
  --leading-heading-sm: 1.45;
  --tracking-heading-sm: 0.11px;
  --text-heading: 28px;
  --leading-heading: 1.43;
  --tracking-heading: 0.14px;
  --text-heading-lg: 30px;
  --leading-heading-lg: 1.27;
  --tracking-heading-lg: 0.24px;
  --text-display: 52px;
  --leading-display: 1.23;

  /* Typography — Weights */
  --font-weight-thin: 100;
  --font-weight-extralight: 200;
  --font-weight-regular: 400;
  --font-weight-medium: 500;

  /* Spacing */
  --spacing-unit: 8px;
  --spacing-8: 8px;
  --spacing-16: 16px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-48: 48px;
  --spacing-56: 56px;

  /* Layout */
  --page-max-width: 1280px;
  --section-gap: 48-64px;
  --card-padding: 16px;
  --element-gap: 16px;

  /* Border Radius */
  --radius-sm: 1px;
  --radius-md: 4px;
  --radius-3xl: 40px;
  --radius-full: 999px;

  /* Named Radii */
  --radius-cards: 4px;
  --radius-badges: 40px;
  --radius-images: 4px;
  --radius-inputs: 4px;
  --radius-buttons: 4px;
  --radius-navpills: 40px;
  --radius-categorychips: 40px;

  /* Surfaces */
  --surface-page-canvas: #fbf8f6;
  --surface-card-surface: #ffffff;
  --surface-elevated-overlay: #ffffff;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-cream-paper: #fbf8f6;
  --color-pure-white: #ffffff;
  --color-ink-black: #000000;
  --color-charcoal: #333333;
  --color-smoke: #6c6a6a;
  --color-ash: #dadada;
  --color-butter-highlight: #f1f29f;

  /* Typography */
  --font-graphik: 'Graphik', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-nantes: 'Nantes', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-graphik-fix-variant: 'Graphik (fix variant)', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-graphikfix: 'Graphik_fix', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 14px;
  --leading-caption: 1.5;
  --tracking-caption: 0.154px;
  --text-body: 16px;
  --leading-body: 1.5;
  --tracking-body: 0.144px;
  --text-subheading: 18px;
  --leading-subheading: 1.44;
  --tracking-subheading: 0.09px;
  --text-heading-sm: 22px;
  --leading-heading-sm: 1.45;
  --tracking-heading-sm: 0.11px;
  --text-heading: 28px;
  --leading-heading: 1.43;
  --tracking-heading: 0.14px;
  --text-heading-lg: 30px;
  --leading-heading-lg: 1.27;
  --tracking-heading-lg: 0.24px;
  --text-display: 52px;
  --leading-display: 1.23;

  /* Spacing */
  --spacing-8: 8px;
  --spacing-16: 16px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-48: 48px;
  --spacing-56: 56px;

  /* Border Radius */
  --radius-sm: 1px;
  --radius-md: 4px;
  --radius-3xl: 40px;
  --radius-full: 999px;
}
```
