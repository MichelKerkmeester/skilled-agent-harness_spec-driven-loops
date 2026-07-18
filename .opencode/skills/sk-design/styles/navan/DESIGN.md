# Navan — Style Reference
> Business-class cabin at violet twilight — a quiet, premium travel interior lit by a single signature violet glow.

**Theme:** light

Navan operates a premium travel-portal visual language: a near-black violet (#15002c) anchors dark surfaces and text, while a single vivid violet (#6307f8) punctuates primary actions and brand moments. White and off-white surfaces dominate, giving the interface the airy feel of a business-class lounge, with editorial Sanomat serifs for headlines and neutral Neue Hass Grotesk for everything else. Components are light-touch: 14px radii on cards and buttons, pill-shaped CTAs, soft violet-tinted highlight cards, and atmospheric gradient washes that introduce the brand violet without flooding the page. The footer flips to a full-bleed deep-violet band, creating a bookend effect that reinforces the brand color as a destination rather than a decoration.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Deep Iris | `#15002c` | `--color-deep-iris` | Footer background, primary text on light surfaces, heading color, dark card surfaces — the near-black violet that carries Navan's brand weight across all dark regions and high-emphasis text |
| Vivid Iris | `#6307f8` | `--color-vivid-iris` | Violet supporting accent for decorative details and low-frequency emphasis. Do not promote it to the primary CTA color |
| Iris Mist | `#e1e2fe` | `--color-iris-mist` | Soft highlight wash, light accent surface, decorative tag fill — the barely-there violet tint that signals brand presence on neutral cards |
| Iris Glow | `linear-gradient(90deg, rgba(0, 0, 0, 0) 0%, rgba(124, 81, 250, 0.3) 35%, rgba(255, 181, 206, 0.3) 50%, rgba(124, 81, 250, 0.3) 65%, rgba(0, 0, 0, 0) 100%)` | `--color-iris-glow` | Mid-stop in atmospheric brand gradients — bridges deep iris and rose highlights in hero washes; Horizontal brand gradient wash — violet to rose light streak used as a decorative band |
| Cinder | `#060000` | `--color-cinder` | Primary text, icon strokes, dark UI text — the body and heading ink |
| Graphite | `#5a5a72` | `--color-graphite` | Muted body text, secondary borders, supporting icon strokes |
| Fog | `#8d8da5` | `--color-fog` | Tertiary text, caption labels, inactive placeholders |
| Smoke | `#70708f` | `--color-smoke` | Secondary text, metadata, low-emphasis labels |
| Mist Border | `#c6c6d2` | `--color-mist-border` | Hairline dividers, card borders, input borders — the universal separator |
| Canvas Tint | `#f1f1f9` | `--color-canvas-tint` | Page background, nav background, surface wash — the cool off-white that sets the overall canvas |
| Surface White | `#f8f8fd` | `--color-surface-white` | Elevated card surface, subtle panel background — sits one step above canvas |
| Pure White | `#ffffff` | `--color-pure-white` | Card surfaces, button text, inverted text on dark fills, badge text |
| Jet | `#000000` | `--color-jet` | High-contrast text, icon fills, logo wordmark |
| Violet Twilight | `radial-gradient(197.36% 161.87% at 4.08% 0%, rgba(65, 5, 102, 0.75) 6.19%, rgba(124, 81, 250, 0.75) 52.28%, rgba(255, 181, 206, 0.75) 91.18%)` | `--color-violet-twilight` | Deep gradient origin for atmospheric hero washes — the darkest stop in radial brand gradients |

## Tokens — Typography

### Neue Hass Grotesk Text — Body, nav, buttons, badges, cards — the workhorse grotesque that carries 90% of the interface. Weights stay light-to-medium (300–500), never bold, keeping the voice conversational rather than corporate · `--font-neue-hass-grotesk-text`
- **Substitute:** Inter, IBM Plex Sans
- **Weights:** 300, 400, 500
- **Sizes:** 10, 12, 14, 15, 16, 18, 20, 22, 23
- **Line height:** 1.20–1.78
- **Role:** Body, nav, buttons, badges, cards — the workhorse grotesque that carries 90% of the interface. Weights stay light-to-medium (300–500), never bold, keeping the voice conversational rather than corporate

### Neue Haas Grotesk Display Pro — Display, nav emphasis, large UI — the 135px weight-300 headline size is the signature: an anti-convention whisper-weight display that signals premium restraint. 0.04em positive tracking on display sizes gives airy breathing room · `--font-neue-haas-grotesk-display-pro`
- **Substitute:** Neue Haas Grotesk, Helvetica Neue
- **Weights:** 300, 400, 500, 700
- **Sizes:** 12, 14, 15, 16, 18, 20, 22, 135
- **Line height:** 0.87–1.71
- **Letter spacing:** 0.04em at 14px+ display sizes
- **OpenType features:** `"ss01" on`
- **Role:** Display, nav emphasis, large UI — the 135px weight-300 headline size is the signature: an anti-convention whisper-weight display that signals premium restraint. 0.04em positive tracking on display sizes gives airy breathing room

### Sanomat — Editorial headlines and section titles — a serif/display face that introduces warmth and a magazine-cover quality. Used at 30–45px with tight 1.0–1.2 leading, it contrasts the grotesque body and signals premium content · `--font-sanomat`
- **Substitute:** Tiempos Headline, Source Serif Pro, Playfair Display
- **Weights:** 400, 500, 600
- **Sizes:** 30, 40, 42, 45
- **Line height:** 1.00–2.13
- **Role:** Editorial headlines and section titles — a serif/display face that introduces warmth and a magazine-cover quality. Used at 30–45px with tight 1.0–1.2 leading, it contrasts the grotesque body and signals premium content

### Neue Hass Grotesk Display — Neue Hass Grotesk Display — detected in extracted data but not described by AI · `--font-neue-hass-grotesk-display`
- **Weights:** 500
- **Sizes:** 14px
- **Line height:** 
- **Role:** Neue Hass Grotesk Display — detected in extracted data but not described by AI

### Karla — Karla — detected in extracted data but not described by AI · `--font-karla`
- **Weights:** 400
- **Sizes:** 16px
- **Line height:** 1.5
- **Role:** Karla — detected in extracted data but not described by AI

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 10px | 1.5 | — | `--text-caption` |
| body | 16px | 1.5 | — | `--text-body` |
| subheading | 20px | 1.36 | — | `--text-subheading` |
| heading-sm | 22px | 1.31 | — | `--text-heading-sm` |
| heading | 30px | 1.2 | — | `--text-heading` |
| heading-lg | 42px | 1.12 | — | `--text-heading-lg` |
| display | 45px | 1 | 0.04px | `--text-display` |
| hero | 135px | 0.87 | 5.4px | `--text-hero` |

## Tokens — Spacing & Shapes

**Base unit:** 4px

**Density:** spacious

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
| 32 | 32px | `--spacing-32` |
| 36 | 36px | `--spacing-36` |
| 40 | 40px | `--spacing-40` |
| 44 | 44px | `--spacing-44` |
| 56 | 56px | `--spacing-56` |
| 60 | 60px | `--spacing-60` |
| 64 | 64px | `--spacing-64` |
| 80 | 80px | `--spacing-80` |
| 140 | 140px | `--spacing-140` |

### Border Radius

| Element | Value |
|---------|-------|
| cards | 14px |
| pills | 9999px |
| badges | 14px |
| inputs | 14px |
| buttons | 14px |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 80px
- **Card padding:** 20px
- **Element gap:** 16px

## Components

### Primary CTA Button
**Role:** Filled brand action

Vivid Iris (#6307f8) fill, white text, 14px radius, ~12px 20px padding, Neue Hass Grotesk Text 14px weight 500. The single high-saturation button in the system — every other interactive surface defers to it.

### Pill CTA Button
**Role:** Rounded brand action in nav

Vivid Iris fill, white text, 9999px radius, 10px 20px padding, weight 500. Used for the nav 'Get started' — the pill form softens the same violet into a friendlier entry point.

### Ghost Request Demo Button
**Role:** Outlined secondary action

Transparent fill, #15002c border 1.5px, #15002c text, 14px radius, ~10px 20px padding. Pairs with the pill CTA in nav; identical silhouette, different fill logic.

### Feature Highlight Card
**Role:** Light-tinted action tile

Iris Mist (#e1e2fe) background, 14px radius, ~20px padding, centered icon + label, white text optional. Used in the hero's 'What would you like to do' grid — the violet tint signals interactivity without being a button.

### Floating Product Card
**Role:** UI screenshot overlay

White background, 14px radius, soft shadow, contains a stylized product panel (e.g., flight card LAX→SYD). Floats over lifestyle photography to ground the abstract gradient in concrete product.

### Top Announcement Bar
**Role:** Product news strip

Full-bleed gradient band, Vivid Iris 'New' pill badge (14px radius, 10px 12px padding, white text, weight 500), white headline text, inline arrow CTA. Sets the premium tone before the nav even appears.

### Navigation Bar
**Role:** Primary site navigation

Canvas Tint (#f1f1f9) background, wordmark left, horizontal nav links (Platform, Solutions, Pricing, Resources, Customers, Company) in Cinder text weight 400, pill CTA + ghost button + 'Log in' + locale flag on the right. Sits at ~72px height.

### Star Rating Block
**Role:** Social proof micro-component

Five violet iris stars, '4.7 out of 5 | 9K+ reviews' in Cinder 14px. Placed in card with light border to feel like an earned badge, not a marketing plug.

### Award Badge Strip
**Role:** Footer recognition row

Row of G2 badge images (Best Usability, Leader, Best Results, etc.) in a contained card with light background. Each badge is a separate image asset, but the strip as a whole signals enterprise credibility.

### Footer Column Block
**Role:** Multi-column site map

Deep Iris (#15002c) background, white column titles weight 500, Fog/Smoke link text 14px weight 400, grouped into 5–6 columns with 40px column gap. The full-bleed dark band is the strongest brand moment on the page.

### App Store Download Pair
**Role:** Footer CTA

Apple App Store and Google Play badges side by side, white background dark-icon style, 14px radius. The only mobile-download surface in the system.

### Success Toast Card
**Role:** Inline confirmation

White background, 14px radius, Vivid Iris icon circle, Cinder text 'Success! Expense submitted. You're done.' Anchored to bottom of a product card as a micro-interaction artifact.

### Region Selector
**Role:** Footer locale switcher

US flag icon + 'Region' text in light neutral, pill or ghost style, sits in the footer's meta row.

## Do's and Don'ts

### Do
- Use Vivid Iris (#6307f8) as the only saturated fill in the interface — reserve it for one CTA per viewport so it stays loud
- Set card and button radius to 14px consistently; use 9999px only for nav-level pill buttons
- Use Sanomat serif for section headlines at 30–45px with tight 1.0–1.2 leading to create editorial weight
- Keep body text weight 400 in Neue Hass Grotesk Text at 14–16px — never bold body copy
- Pair every product photo with a floating white UI card overlay to ground abstract photography in concrete product
- Bookend pages with full-bleed brand surfaces: gradient or white at the top, deep iris footer at the bottom
- Use Canvas Tint (#f1f1f9) for page backgrounds and Pure White (#ffffff) for cards — never invert this hierarchy

### Don't
- Do not use Vivid Iris (#6307f8) for body text, borders, or large background fills — it is a CTA color only
- Do not introduce new accent hues — the system is monochromatic violet; any non-violet chromatic will break the palette
- Do not use drop shadows on standard cards; rely on surface tone and 14px radius for elevation
- Do not set body text in Sanomat — the serif is reserved for editorial headlines
- Do not use heavy weight 600+ in body or nav — the system speaks in 300–500 weights only
- Do not use 0px or 8px radii on cards and buttons — the 14px radius is signature and must stay consistent
- Do not stack multiple gradient washes on a single section — one atmospheric gradient per page region

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 1 | Canvas | `#f1f1f9` | Base page background — the cool off-white that everything else sits on |
| 2 | Card White | `#ffffff` | Card surfaces, product mockups, elevated panels |
| 3 | Surface Lift | `#f8f8fd` | Subtle secondary surface, hover wash, input fill |
| 4 | Iris Mist | `#e1e2fe` | Light brand-tinted highlight surface for feature cards and tags |
| 5 | Footer Iris | `#15002c` | Full-bleed dark footer band — the brand's destination surface |

## Elevation

Navan avoids heavy drop shadows. Elevation is implied by surface tone (white card on f1f1f9 canvas) and 14px radius rather than shadow stacks. The only shadowed elements are floating product mockups and toasts, which use a single soft long-blur shadow at most.

## Imagery

Hero opens with an abstract radial gradient wash (deep iris → violet → rose) that reads as atmospheric, not photographic. Below the fold, photography appears as full-bleed lifestyle shots: professionals in transit (two women walking through a sunlit terminal, a woman in a car, a man in a hotel corridor) — warm, candid, editorial. Product is shown as floating UI cards overlaid on these photos, never as full screenshots. Icons are minimal outlined line-style at 1.5px stroke, mono in Cinder. The visual rhythm alternates: gradient → white → photography+UI cards → white → dark footer. Imagery is content-bearing, not decorative — every photo carries a product overlay.

## Layout

Max-width 1200px contained layout with full-bleed bands. Hero is a full-bleed gradient strip with an inline announcement and a phone mockup, followed by a white content section that holds a serif headline (Sanomat 40–45px), a 2×3 grid of feature highlight cards, and a centered violet CTA. Sections alternate: white content → grayscale logo strip → centered text block → 3-column product+image cards → white reviews → full-bleed dark footer. Section gaps run 80px. Navigation is a single sticky top bar on Canvas Tint; no sidebar. Grid usage is conservative: 2-column feature grids, 3-column product showcases, 5–6-column footer. The page reads top-to-bottom as a confident vertical scroll with brand-color bookends (gradient top, deep iris bottom).

## Agent Prompt Guide

Quick Color Reference
• primary text: #060000 (Cinder)
• background: #f1f1f9 (Canvas Tint)
• card surface: #ffffff
• border: #c6c6d2 (Mist Border)
• accent surface: #e1e2fe (Iris Mist)
• primary action: no distinct CTA color

Example Component Prompts
No distinct primary action color was observed; use the extracted neutral button treatments instead of inventing a filled CTA color.

2. **Feature Highlight Card**: Iris Mist (#e1e2fe) background, 14px radius, 20px padding all sides, centered outlined icon in Cinder (#060000), label text 14px weight 500 in Cinder. Used in 2–3 column grids.

3. **Editorial Section Headline**: Sanomat 42px weight 400, Cinder (#060000) text, line-height 1.12, centered. Pair with body subtext at Neue Hass Grotesk Text 18px weight 400 in Smoke (#70708f).

4. **Floating Product Card over Photography**: Pure White (#ffffff) background, 14px radius, single soft shadow (e.g. 0 8px 32px rgba(21,0,44,0.12)), 20px padding, contains a stylized flight/expense UI panel with Vivid Iris accent for selected rows.

5. **Dark Footer Band**: Deep Iris (#15002c) full-bleed background, 80px vertical padding, 5–6 columns of links with white column titles (weight 500, 14px) and Fog (#8d8da5) link text (weight 400, 14px), Mist Border (#c6c6d2) 1px top divider separating columns from meta row.

## Gradient System

Navan uses gradients as atmospheric brand signals, not functional fills. The palette is fixed: deep iris (#410566) → iris (#7c51fa) → rose pink (#ffb5ce), always at 0.25–0.75 opacity. Apply as full-bleed radial washes on hero bands or as horizontal beams across feature sections. Never use gradients on buttons, cards, or text. The rose pink stop is the surprise — it prevents the violet from feeling monolithic and gives the system warmth.

## Type Pairing Logic

Sanomat and Neue Haas Grotesk are deliberately paired: Sanomat carries the editorial voice (headlines, section openers, pull quotes) while Neue Haas carries the utility voice (body, nav, buttons, labels). The contrast between the two is the system's most distinctive typographic choice — it reads as 'premium travel magazine meets modern SaaS dashboard.' Never use both in the same line; Sanomat headlines sit above Neue Hass subheads, not inline.

## Similar Brands

- **Brex** — Same dark-violet footer band, same single-vivid-accent discipline, same wide white-canvas layout with floating product cards
- **Ramp** — Same clean grotesque body type paired with a signature accent color, same nav-pill + ghost-button CTA pairing
- **TripActions (legacy Navan rebrand)** — Same dual brand identity split between corporate finance UI and consumer-travel visual language
- **Linear** — Same restraint in color usage — one chromatic accent against neutral surfaces, same generous spacing rhythm
- **Squarespace** — Same editorial-serif-headline + modern-grotesk-body pairing, same full-bleed gradient hero opening

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-deep-iris: #15002c;
  --color-vivid-iris: #6307f8;
  --color-iris-mist: #e1e2fe;
  --color-iris-glow: #7c51fa;
  --gradient-iris-glow: linear-gradient(90deg, rgba(0, 0, 0, 0) 0%, rgba(124, 81, 250, 0.3) 35%, rgba(255, 181, 206, 0.3) 50%, rgba(124, 81, 250, 0.3) 65%, rgba(0, 0, 0, 0) 100%);
  --color-cinder: #060000;
  --color-graphite: #5a5a72;
  --color-fog: #8d8da5;
  --color-smoke: #70708f;
  --color-mist-border: #c6c6d2;
  --color-canvas-tint: #f1f1f9;
  --color-surface-white: #f8f8fd;
  --color-pure-white: #ffffff;
  --color-jet: #000000;
  --color-violet-twilight: #410566;
  --gradient-violet-twilight: radial-gradient(197.36% 161.87% at 4.08% 0%, rgba(65, 5, 102, 0.75) 6.19%, rgba(124, 81, 250, 0.75) 52.28%, rgba(255, 181, 206, 0.75) 91.18%);

  /* Typography — Font Families */
  --font-neue-hass-grotesk-text: 'Neue Hass Grotesk Text', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-neue-haas-grotesk-display-pro: 'Neue Haas Grotesk Display Pro', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-sanomat: 'Sanomat', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-neue-hass-grotesk-display: 'Neue Hass Grotesk Display', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-karla: 'Karla', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 10px;
  --leading-caption: 1.5;
  --text-body: 16px;
  --leading-body: 1.5;
  --text-subheading: 20px;
  --leading-subheading: 1.36;
  --text-heading-sm: 22px;
  --leading-heading-sm: 1.31;
  --text-heading: 30px;
  --leading-heading: 1.2;
  --text-heading-lg: 42px;
  --leading-heading-lg: 1.12;
  --text-display: 45px;
  --leading-display: 1;
  --tracking-display: 0.04px;
  --text-hero: 135px;
  --leading-hero: 0.87;
  --tracking-hero: 5.4px;

  /* Typography — Weights */
  --font-weight-light: 300;
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
  --spacing-28: 28px;
  --spacing-32: 32px;
  --spacing-36: 36px;
  --spacing-40: 40px;
  --spacing-44: 44px;
  --spacing-56: 56px;
  --spacing-60: 60px;
  --spacing-64: 64px;
  --spacing-80: 80px;
  --spacing-140: 140px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 80px;
  --card-padding: 20px;
  --element-gap: 16px;

  /* Border Radius */
  --radius-md: 4px;
  --radius-xl: 14px;
  --radius-full: 9999px;

  /* Named Radii */
  --radius-cards: 14px;
  --radius-pills: 9999px;
  --radius-badges: 14px;
  --radius-inputs: 14px;
  --radius-buttons: 14px;

  /* Surfaces */
  --surface-canvas: #f1f1f9;
  --surface-card-white: #ffffff;
  --surface-surface-lift: #f8f8fd;
  --surface-iris-mist: #e1e2fe;
  --surface-footer-iris: #15002c;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-deep-iris: #15002c;
  --color-vivid-iris: #6307f8;
  --color-iris-mist: #e1e2fe;
  --color-iris-glow: #7c51fa;
  --color-cinder: #060000;
  --color-graphite: #5a5a72;
  --color-fog: #8d8da5;
  --color-smoke: #70708f;
  --color-mist-border: #c6c6d2;
  --color-canvas-tint: #f1f1f9;
  --color-surface-white: #f8f8fd;
  --color-pure-white: #ffffff;
  --color-jet: #000000;
  --color-violet-twilight: #410566;

  /* Typography */
  --font-neue-hass-grotesk-text: 'Neue Hass Grotesk Text', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-neue-haas-grotesk-display-pro: 'Neue Haas Grotesk Display Pro', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-sanomat: 'Sanomat', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-neue-hass-grotesk-display: 'Neue Hass Grotesk Display', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-karla: 'Karla', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 10px;
  --leading-caption: 1.5;
  --text-body: 16px;
  --leading-body: 1.5;
  --text-subheading: 20px;
  --leading-subheading: 1.36;
  --text-heading-sm: 22px;
  --leading-heading-sm: 1.31;
  --text-heading: 30px;
  --leading-heading: 1.2;
  --text-heading-lg: 42px;
  --leading-heading-lg: 1.12;
  --text-display: 45px;
  --leading-display: 1;
  --tracking-display: 0.04px;
  --text-hero: 135px;
  --leading-hero: 0.87;
  --tracking-hero: 5.4px;

  /* Spacing */
  --spacing-4: 4px;
  --spacing-8: 8px;
  --spacing-12: 12px;
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-28: 28px;
  --spacing-32: 32px;
  --spacing-36: 36px;
  --spacing-40: 40px;
  --spacing-44: 44px;
  --spacing-56: 56px;
  --spacing-60: 60px;
  --spacing-64: 64px;
  --spacing-80: 80px;
  --spacing-140: 140px;

  /* Border Radius */
  --radius-md: 4px;
  --radius-xl: 14px;
  --radius-full: 9999px;
}
```
