# 7shifts — Style Reference
> warm diner counter with neon chalk accents — a bright restaurant counter where indigo buttons, orange hand-drawn underlines, and lime highlighter marks sit on clean white and warm bone surfaces, with occasional black bands that make the colors glow.

**Theme:** light

7shifts is a light, air-kissed SaaS canvas with a single punchy indigo as the call-to-action and a small cast of warm accents doing the personality work. The page reads like a clean restaurant counter: white surface, warm bone secondary panels, soft pastel card variants, and the occasional full-bleed black band that makes everything around it feel brighter. Orange is the signature flourish — it underlines hero words in a hand-drawn stroke, floods feature backgrounds, and marks tabbed content — while a lime-green acts as highlighter text inside dark sections. Components are generous and rounded (pill buttons, 20px cards, 40px hero plates) with a compact vertical rhythm. The lone script typeface, Nanum Pen Script, shows up only as a personality accent under hero copy and never on body or UI controls.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Indigo Bolt | `#4570ff` | `--color-indigo-bolt` | Violet action color for filled buttons, selected navigation states, and focused conversion moments. |
| Ember Orange | `#ff6808` | `--color-ember-orange` | Orange accent for outlined action borders, linked labels, and lightweight interactive emphasis |
| Lime Highlighter | `#c6ff94` | `--color-lime-highlighter` | Green text accent for links, tags, and emphasized short phrases. |
| Lavender Mist | `#ebdcff` | `--color-lavender-mist` | Soft card surface, gentle section background — pastel variant for breaking up the white canvas without adding noise |
| Ice Blue | `#d6e0ff` | `--color-ice-blue` | Cool pastel card surface, section wash — pairs with indigo to reinforce the primary brand hue at low intensity |
| Lilac Bloom | `#c293f1` | `--color-lilac-bloom` | Saturated card background in feature card grid — bolder pastel, one of four colored card variants that rotate across feature rows |
| Deep Navy | `#193f78` | `--color-deep-navy` | Blue wash for highlight backgrounds, decorative bands, and soft emphasis behind content. Do not promote it to the primary CTA color |
| Forest Sage | `#244f47` | `--color-forest-sage` | Muted teal card variant — grounded, earthy counterpoint in the four-color card rotation |
| Warm Bone | `#f1f0ec` | `--color-warm-bone` | Secondary canvas, soft section backgrounds, neutral action borders — the off-white that keeps the page from feeling sterile |
| Paper White | `#ffffff` | `--color-paper-white` | Page background, card surfaces, button fills, body text on dark sections |
| Ink Black | `#000000` | `--color-ink-black` | Primary text, dark feature sections, filled dark comparison cards — creates the dramatic black bands that make the colors pop |
| Hairline | `#e5e7eb` | `--color-hairline` | Borders, dividers, table rules, input borders — the workhorse neutral stroke |
| Stone | `#d1d5db` | `--color-stone` | Mid-gray strokes, subtle dividers, muted icon backgrounds |
| Smoke | `#6e6d6c` | `--color-smoke` | Secondary body text, helper text, muted captions |
| Graphite | `#555555` | `--color-graphite` | Tertiary text, button labels on neutral buttons |

## Tokens — Typography

### Regular — Regular — detected in extracted data but not described by AI · `--font-regular`
- **Weights:** 400
- **Sizes:** 11px, 12px, 14px, 16px, 18px, 36px, 64px
- **Line height:** 1, 1.11, 1.14, 1.2, 1.3, 1.33, 1.38, 1.4, 1.5, 1.56
- **Letter spacing:** -0.05, -0.03, -0.025, -0.022, -0.02
- **Role:** Regular — detected in extracted data but not described by AI

### A geometric grotesque sans-serif (custom-marketed as the site font — Inter, Manrope, or DM Sans are close substitutes) — All UI, body, navigation, and headings. Weight 500 carries buttons, nav links, and sub-headings; weight 400 owns body copy; weight 700 reserved for eyebrow labels with opened tracking. The full range from 11px captions to 150px display headings makes this a single-family system doing everything. · `--font-a-geometric-grotesque-sans-serif-custom-marketed-as-the-site-font-inter-manrope-or-dm-sans-are-close-substitutes`
- **Substitute:** Inter (closest match for the geometric forms and tight tracking), Manrope, DM Sans
- **Weights:** 400, 500, 700
- **Sizes:** 11, 12, 14, 16, 18, 24, 28, 36, 40, 48, 64, 120, 150
- **Line height:** 0.75–1.56 depending on size; tightest at display sizes (0.75–0.93), standard at body (1.4–1.5)
- **Letter spacing:** Tight negative tracking throughout: -0.05em at 120–150px display, -0.03em at 48–64px headings, -0.02em to -0.025em at 24–40px sub-headings, near-zero at 14–18px body. The 700-weight eyebrow caps at 14px use +0.025em (opened tracking) to read as a label, not body.
- **OpenType features:** `"ss01" on, "cv11" on`
- **Role:** All UI, body, navigation, and headings. Weight 500 carries buttons, nav links, and sub-headings; weight 400 owns body copy; weight 700 reserved for eyebrow labels with opened tracking. The full range from 11px captions to 150px display headings makes this a single-family system doing everything.

### Nanum Pen Script — Hand-drawn personality accent — appears only under hero copy (the orange 'actually work' underline) and similar signature moments. Never used for body, UI, or navigation. This is the brand's most distinctive typographic move: a script that says 'we're human, not enterprise software'. · `--font-nanum-pen-script`
- **Substitute:** Caveat, Kalam, Permanent Marker
- **Weights:** 400, 500
- **Sizes:** 28, 30
- **Line height:** 1.0–1.5
- **Letter spacing:** -0.0300em
- **Role:** Hand-drawn personality accent — appears only under hero copy (the orange 'actually work' underline) and similar signature moments. Never used for body, UI, or navigation. This is the brand's most distinctive typographic move: a script that says 'we're human, not enterprise software'.

### Medium — Medium — detected in extracted data but not described by AI · `--font-medium`
- **Weights:** 500
- **Sizes:** 11px, 12px, 14px, 16px, 18px, 24px, 28px, 36px, 40px, 48px, 64px, 120px, 150px
- **Line height:** 0.75, 0.9, 0.93, 1, 1.1, 1.11, 1.33, 1.4, 1.43, 1.5
- **Letter spacing:** -0.03, -0.02, -0.018, -0.012
- **Role:** Medium — detected in extracted data but not described by AI

### Bold — Bold — detected in extracted data but not described by AI · `--font-bold`
- **Weights:** 700
- **Sizes:** 14px
- **Line height:** 1.14
- **Letter spacing:** 0.025
- **Role:** Bold — detected in extracted data but not described by AI

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 11px | 1.4 | -0.2px | `--text-caption` |
| body | 14px | 1.5 | -0.28px | `--text-body` |
| body-lg | 16px | 1.5 | -0.32px | `--text-body-lg` |
| subheading | 18px | 1.4 | -0.36px | `--text-subheading` |
| heading-sm | 24px | 1.33 | -0.6px | `--text-heading-sm` |
| heading | 36px | 1.2 | -0.9px | `--text-heading` |
| heading-lg | 48px | 1.14 | -1.2px | `--text-heading-lg` |
| display | 64px | 1.11 | -1.92px | `--text-display` |

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
| 20 | 20px | `--spacing-20` |
| 24 | 24px | `--spacing-24` |
| 28 | 28px | `--spacing-28` |
| 40 | 40px | `--spacing-40` |
| 48 | 48px | `--spacing-48` |
| 56 | 56px | `--spacing-56` |
| 60 | 60px | `--spacing-60` |
| 80 | 80px | `--spacing-80` |
| 92 | 92px | `--spacing-92` |
| 100 | 100px | `--spacing-100` |
| 120 | 120px | `--spacing-120` |
| 160 | 160px | `--spacing-160` |

### Border Radius

| Element | Value |
|---------|-------|
| nav | 16px |
| hero | 40px |
| tags | 9999px |
| cards | 20px |
| icons | 8px |
| inputs | 12px |
| buttons | 9999px |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 64-80px
- **Card padding:** 20-24px
- **Element gap:** 8-12px

## Components

### Primary Pill Button
**Role:** Main call-to-action — 'Get your free trial', demo requests

Filled #4570ff indigo, white text, 9999px radius (true pill), 12px vertical × 24px horizontal padding, weight 500 at 16px. Single shadow or none. This is the only filled chromatic button in the system.

### Outlined Orange Button
**Role:** Secondary action on hero or feature sections

Transparent fill, 2px #ff6808 border, #ff6808 text, 9999px radius, 10px × 20px padding. Reads as energetic, not aggressive.

### Ghost Nav Button
**Role:** Navigation link with hover affordance

Transparent fill, #555555 text at 16px weight 500, 8px vertical × 12px horizontal padding, 16px radius. Becomes filled #f1f0ec on hover.

### Login Pill Button
**Role:** Low-emphasis utility action in the header

Filled #f1f0ec warm bone, #000000 text, 9999px radius, 10px × 20px padding. Sits next to the primary indigo CTA to create a quiet/active pair.

### Content Card
**Role:** Feature cards, testimonial cards, product modules

White surface, 20px radius, 20–24px padding, optional 1px #e5e7eb hairline border. No shadow by default — the dark band context or colored fill provides the elevation.

### Colored Feature Card
**Role:** Rotating pastel/navy/forest card variant in feature grids

One of four fills — #ebdcff lavender, #d6e0ff ice blue, #c293f1 lilac, #193f78 navy, or #244f47 sage. 20px radius, 20–24px padding, white or black text depending on fill luminance. This rotation is a signature device for adding variety without breaking the system.

### Dark Comparison Card
**Role:** 'With 7shifts' side of the before/after split

Filled #000000, white text, 20px radius, 24px padding. Paired against a light bone card with the same radius to create the side-by-side contrast block.

### Hero Plate
**Role:** Full-width hero container and case-study band

Full-bleed white or dark photo, 40px radius on the top or bottom edge when transitioning into a card grid. Contains centered headline at 48–64px weight 500 with the Nanum Pen Script orange underline accent.

### Tabbed Feature Section
**Role:** Product feature showcase with switchable tabs

White background, centered heading at 36–48px, tab row with active tab marked by an indigo underline and weight 500. Content below splits into a colored feature panel (orange or pastel) on the left and white text panel on the right, both at 20px radius.

### Pill Tag / Case Study Chip
**Role:** Case study links, category tags, small badges

Filled #ffffff or #f1f0ec, #000000 text at 12–14px weight 400, 9999px radius, 4px × 12px padding. Sits beneath logo grids.

### Logo Grid
**Role:** Customer trust strip — restaurant chain logos

Horizontal row of brand logos on a dark photo background, each with a white pill 'Case study' chip beneath. No card containers; logos sit directly on the photographic surface.

### Comparison Check / Cross List
**Role:** Bullet-style benefits list inside comparison cards

Each item is a 16px weight 500 label preceded by a circular checkmark (#000000 filled, white check) or cross (#000000 with white ×). Items stack at 8px row gap inside the card padding.

### Hand-Drawn Underline Accent
**Role:** Personality flourish under hero or section keywords

Nanum Pen Script at 28–30px in #ff6808, positioned beneath a single key word in the headline. Never used for more than one word per heading, and only on hero/feature sections — not on body copy.

## Do's and Don'ts

### Do
- Use #4570ff exclusively for primary actions — pill button at 9999px radius, 12px × 24px padding, 16px weight 500 white text
- Reach for #ff6808 (Ember Orange) for the signature personality accents: hero underlines, feature section backgrounds, outlined buttons — never for body text or neutral UI
- Apply 20px radius to all cards, 9999px to all buttons and tags, 40px to hero plates and full-bleed section edges
- Set display headings (64px and above) at -0.05em letter-spacing; tighten progressively to -0.02em at 24px and reach near-zero at 14px body
- Pair the Nanum Pen Script only with hero or section-level headings, and only beneath a single keyword — it is punctuation, not a running style
- Alternate full-bleed black bands with warm bone (#f1f0ec) sections to create the contrast rhythm that makes the pastel and lime accents feel alive
- Use the four pastel card variants (#ebdcff, #d6e0ff, #c293f1, #193f78, #244f47) in rotation across feature grids to add color variety without introducing new tokens

### Don't
- Don't fill buttons with #ff6808 — orange is an accent, not an action; the only filled action color is #4570ff
- Don't apply Nanum Pen Script to body copy, navigation, buttons, or anything below heading level — it loses its personality when overused
- Don't use shadows or heavy elevation to separate cards — the system relies on fill contrast (white on bone, pastel on white, black on photo), not drop shadows
- Don't introduce new saturated colors for UI — the palette is intentionally tight: one indigo, one orange, one lime, and four pastel variants
- Don't set body text below 14px or above 18px — the readable range is narrow and the negative tracking is calibrated for it
- Don't use #c6ff94 (Lime Highlighter) as a background outside of dark or photo sections — on white it reads as low-contrast and washed out
- Don't apply +0.025em opened tracking to anything other than 14px weight 700 eyebrow labels — it is reserved for that specific all-caps label style

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Page Canvas | `#ffffff` | Primary page background |
| 1 | Warm Bone Section | `#f1f0ec` | Secondary canvas, large content bands, soft section backgrounds |
| 2 | Card Surface | `#ffffff` | Product cards, content cards sitting on the bone background |
| 3 | Dark Band | `#000000` | Full-bleed dark sections, dramatic comparison cards, photo overlays |
| 4 | Pastel Wash | `#d6e0ff / #ebdcff` | Soft tinted card and section variants for visual rhythm |

## Elevation

The system intentionally avoids drop shadows. Elevation is communicated through fill contrast — white cards on warm bone surfaces, pastel cards on white, black cards on photo backgrounds — and through the dramatic black bands that act as full-bleed separators. The absence of shadows is a deliberate choice that keeps the page feeling flat, modern, and graphic, letting the orange and lime accents do the visual lifting instead of shadow stacks.

## Imagery

Imagery is sparse and purposeful. The only full-bleed photograph is a dark, warm-lit restaurant interior (wood tones, ambient glow) used as a single trust/case-study band — it grounds the brand in its restaurant context without dominating. Product screenshots appear inside dark-bordered device frames with the app UI composited over the photo, showing real software rather than illustrations. No illustrations, no 3D renders, no abstract graphics. Icons are minimal: simple filled circles for check/cross marks in comparison lists. The visual weight is overwhelmingly typographic and layout-driven, with color (not imagery) doing the decorative work.

## Layout

Page is centered with a 1200px max-width content well on a pure white canvas. The hero is a centered text block — large 48–64px weight 500 headline, orange Nanum Pen Script underline accent, single indigo pill CTA — with no hero image. The page alternates between four content shapes: (1) centered text + CTA blocks on white, (2) side-by-side comparison cards in a 2-column grid with a light bone card paired against a black card, (3) full-bleed dark photographic bands for social proof, and (4) tabbed feature sections with a colored panel + white text panel split. Feature grids use 3–4 column card layouts with rotating pastel card fills. Section gaps run 64–80px, with 20–24px card padding and 8–12px element gaps. Navigation is a top bar: logo left, 6 nav links center, indigo CTA + bone login pill right. The overall density is compact but with generous breathing room around the dark bands, which act as full-bleed dividers between otherwise quiet content sections.

## Agent Prompt Guide

Quick Color Reference:
- primary action: #4570ff (filled action)
- Accent / personality: #ff6808 (Ember Orange)
- Highlight on dark: #c6ff94 (Lime)
- Text primary: #000000
- Text secondary: #6e6d6c (Smoke)
- Surface base: #ffffff (Paper White)
- Surface secondary: #f1f0ec (Warm Bone)
- Border: #e5e7eb (Hairline)

Example Component Prompts:

1. Create a hero section on white: centered 64px weight 500 headline in #000000 with the word 'actually' (or one key word) underlined in #ff6808 using Nanum Pen Script at 28px. Subhead at 18px weight 400 in #6e6d6c. Single indigo pill CTA at 9999px radius, #4570ff fill, white 16px weight 500 text, 12px × 24px padding. Section vertical padding 80px.

2. Create a before/after comparison: two cards side by side at 20px radius. Left card #f1f0ec fill, 24px padding, 36px weight 500 heading in #000000, three list items with 8px row gap, each prefixed by a filled black circle with a white × mark. Right card identical structure but #000000 fill, white text, and filled black circle with white check mark.

3. Create a feature grid of 4 cards in a row: each card 20px radius, 24px padding, varying pastel fills — #ebdcff, #d6e0ff, #c293f1, #193f78. Heading at 24px weight 500, body at 14px weight 400. Text color switches to white on #193f78 and #244f47, stays #000000 on the lighter pastels.

4. Create a tabbed product feature: white background section, centered 36px weight 500 heading. Tab row below with 5 tab labels in 16px weight 400 #6e6d6c; active tab is 16px weight 500 #000000 with a 2px #4570ff underline. Content below: left half is a #ff6808 orange panel (20px radius, 20px padding) containing a product screenshot frame; right half is a white panel (20px radius, 20px padding) with a 24px weight 500 heading and 14px body text.

5. Create a case study logo band: full-bleed dark restaurant photo background, 40px top radius. Row of 6 restaurant logos in white, evenly spaced. Beneath each logo, a white pill tag (9999px radius, #ffffff fill, 12px weight 400 #000000 text, 4px × 12px padding) reading 'Case study'.

## Similar Brands

- **Toast** — Same restaurant-industry SaaS playbook: white canvas, single punchy CTA color, warm pastel card variants, and generous pill-shaped buttons
- **Linear** — Same tight negative tracking on geometric sans-serif headings and a single saturated action color against an otherwise near-monochrome interface
- **Calendly** — Same centered-hero-on-white pattern with a single pill CTA, alternating light/dark comparison sections, and rounded 20px cards
- **Webflow** — Same mix of quiet monochrome UI with bursts of color used as section backgrounds and a script/handwritten accent for personality moments

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-indigo-bolt: #4570ff;
  --color-ember-orange: #ff6808;
  --color-lime-highlighter: #c6ff94;
  --color-lavender-mist: #ebdcff;
  --color-ice-blue: #d6e0ff;
  --color-lilac-bloom: #c293f1;
  --color-deep-navy: #193f78;
  --color-forest-sage: #244f47;
  --color-warm-bone: #f1f0ec;
  --color-paper-white: #ffffff;
  --color-ink-black: #000000;
  --color-hairline: #e5e7eb;
  --color-stone: #d1d5db;
  --color-smoke: #6e6d6c;
  --color-graphite: #555555;

  /* Typography — Font Families */
  --font-regular: 'Regular', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-a-geometric-grotesque-sans-serif-custom-marketed-as-the-site-font-inter-manrope-or-dm-sans-are-close-substitutes: 'A geometric grotesque sans-serif (custom-marketed as the site font — Inter, Manrope, or DM Sans are close substitutes)', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-nanum-pen-script: 'Nanum Pen Script', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-medium: 'Medium', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-bold: 'Bold', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 11px;
  --leading-caption: 1.4;
  --tracking-caption: -0.2px;
  --text-body: 14px;
  --leading-body: 1.5;
  --tracking-body: -0.28px;
  --text-body-lg: 16px;
  --leading-body-lg: 1.5;
  --tracking-body-lg: -0.32px;
  --text-subheading: 18px;
  --leading-subheading: 1.4;
  --tracking-subheading: -0.36px;
  --text-heading-sm: 24px;
  --leading-heading-sm: 1.33;
  --tracking-heading-sm: -0.6px;
  --text-heading: 36px;
  --leading-heading: 1.2;
  --tracking-heading: -0.9px;
  --text-heading-lg: 48px;
  --leading-heading-lg: 1.14;
  --tracking-heading-lg: -1.2px;
  --text-display: 64px;
  --leading-display: 1.11;
  --tracking-display: -1.92px;

  /* Typography — Weights */
  --font-weight-regular: 400;
  --font-weight-medium: 500;
  --font-weight-bold: 700;

  /* Spacing */
  --spacing-unit: 4px;
  --spacing-4: 4px;
  --spacing-8: 8px;
  --spacing-12: 12px;
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-28: 28px;
  --spacing-40: 40px;
  --spacing-48: 48px;
  --spacing-56: 56px;
  --spacing-60: 60px;
  --spacing-80: 80px;
  --spacing-92: 92px;
  --spacing-100: 100px;
  --spacing-120: 120px;
  --spacing-160: 160px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 64-80px;
  --card-padding: 20-24px;
  --element-gap: 8-12px;

  /* Border Radius */
  --radius-lg: 8px;
  --radius-xl: 12px;
  --radius-2xl: 16px;
  --radius-2xl-2: 20px;
  --radius-3xl: 24px;
  --radius-3xl-2: 40px;
  --radius-full: 9999px;

  /* Named Radii */
  --radius-nav: 16px;
  --radius-hero: 40px;
  --radius-tags: 9999px;
  --radius-cards: 20px;
  --radius-icons: 8px;
  --radius-inputs: 12px;
  --radius-buttons: 9999px;

  /* Surfaces */
  --surface-page-canvas: #ffffff;
  --surface-warm-bone-section: #f1f0ec;
  --surface-card-surface: #ffffff;
  --surface-dark-band: #000000;
  --surface-pastel-wash: #d6e0ff / #ebdcff;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-indigo-bolt: #4570ff;
  --color-ember-orange: #ff6808;
  --color-lime-highlighter: #c6ff94;
  --color-lavender-mist: #ebdcff;
  --color-ice-blue: #d6e0ff;
  --color-lilac-bloom: #c293f1;
  --color-deep-navy: #193f78;
  --color-forest-sage: #244f47;
  --color-warm-bone: #f1f0ec;
  --color-paper-white: #ffffff;
  --color-ink-black: #000000;
  --color-hairline: #e5e7eb;
  --color-stone: #d1d5db;
  --color-smoke: #6e6d6c;
  --color-graphite: #555555;

  /* Typography */
  --font-regular: 'Regular', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-a-geometric-grotesque-sans-serif-custom-marketed-as-the-site-font-inter-manrope-or-dm-sans-are-close-substitutes: 'A geometric grotesque sans-serif (custom-marketed as the site font — Inter, Manrope, or DM Sans are close substitutes)', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-nanum-pen-script: 'Nanum Pen Script', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-medium: 'Medium', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-bold: 'Bold', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 11px;
  --leading-caption: 1.4;
  --tracking-caption: -0.2px;
  --text-body: 14px;
  --leading-body: 1.5;
  --tracking-body: -0.28px;
  --text-body-lg: 16px;
  --leading-body-lg: 1.5;
  --tracking-body-lg: -0.32px;
  --text-subheading: 18px;
  --leading-subheading: 1.4;
  --tracking-subheading: -0.36px;
  --text-heading-sm: 24px;
  --leading-heading-sm: 1.33;
  --tracking-heading-sm: -0.6px;
  --text-heading: 36px;
  --leading-heading: 1.2;
  --tracking-heading: -0.9px;
  --text-heading-lg: 48px;
  --leading-heading-lg: 1.14;
  --tracking-heading-lg: -1.2px;
  --text-display: 64px;
  --leading-display: 1.11;
  --tracking-display: -1.92px;

  /* Spacing */
  --spacing-4: 4px;
  --spacing-8: 8px;
  --spacing-12: 12px;
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-28: 28px;
  --spacing-40: 40px;
  --spacing-48: 48px;
  --spacing-56: 56px;
  --spacing-60: 60px;
  --spacing-80: 80px;
  --spacing-92: 92px;
  --spacing-100: 100px;
  --spacing-120: 120px;
  --spacing-160: 160px;

  /* Border Radius */
  --radius-lg: 8px;
  --radius-xl: 12px;
  --radius-2xl: 16px;
  --radius-2xl-2: 20px;
  --radius-3xl: 24px;
  --radius-3xl-2: 40px;
  --radius-full: 9999px;
}
```
