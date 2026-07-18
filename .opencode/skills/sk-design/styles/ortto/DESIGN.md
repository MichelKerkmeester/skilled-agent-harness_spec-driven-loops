# Ortto — Style Reference
> blueprint on midnight paper

**Theme:** light

Ortto reads as a product brief on quality stock: near-black hero panels yield to warm-white editorial sections, held together by a single vivid blue that is the only chromatic voice in an otherwise monochrome system. Display headlines use a humanist serif (Ivar Text) at 64–72px with negative tracking, while body and UI sit in a precise neo-grotesque sans (Haas Grot Text) — the pairing gives marketing copy the gravity of print journalism and product surfaces the neutrality of a control panel. Buttons are pill-shaped and filled blue, product screenshots float on a six-layer diffuse shadow, and embedded app captures are treated as first-class content rather than decoration. The overall effect is a marketing site that feels like the product's own manual — confident, specific, almost entirely black-and-white with one electric blue accent.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Electric Blue | `#1070ff` | `--color-electric-blue` | Primary action buttons, active nav, accent borders, eyebrow labels, full-width announcement band — the single chromatic voice in the system |
| Midnight Ink | `#14171f` | `--color-midnight-ink` | Dark hero panels, navigation bar, and logo strip backgrounds — creates high-contrast showcase zones before the light editorial sections |
| Charcoal | `#252525` | `--color-charcoal` | Primary body text, display headlines in light sections, and strong borders — the workhorse text and edge color above the fold |
| Graphite | `#6d6b70` | `--color-graphite` | Secondary body text, muted helper copy, and subtle borders — quiet supporting type that recedes behind Charcoal |
| Paper White | `#ffffff` | `--color-paper-white` | Primary canvas, product screenshot backgrounds, card surfaces, and inverse text on dark panels |
| Cream | `#f9f8f7` | `--color-cream` | Warm-tinted surface for subtle differentiation from pure white — used on alternate section bands and soft card fills |
| Onyx | `#000000` | `--color-onyx` | Hairline borders, icon strokes, and high-emphasis outlines — the structural linework color |

## Tokens — Typography

### sans-serif — sans-serif — detected in extracted data but not described by AI · `--font-sans-serif`
- **Weights:** 400
- **Sizes:** 12px, 16px
- **Line height:** 1.2
- **Role:** sans-serif — detected in extracted data but not described by AI

### Ivar Text — Display and editorial headlines at 48–72px, subheading at 20–24px, and italic blockquotes — a humanist serif that lends marketing copy print-journalism weight · `--font-ivar-text`
- **Substitute:** Source Serif 4, Lora, or Tiempos Text
- **Weights:** 400
- **Sizes:** 20, 24, 48, 64, 72px
- **Line height:** 1.00–1.40
- **Letter spacing:** -0.48px at 48px, -0.26px at 64px, -0.29px at 72px; -0.20px at 20px; 0.07px at 24px
- **Role:** Display and editorial headlines at 48–72px, subheading at 20–24px, and italic blockquotes — a humanist serif that lends marketing copy print-journalism weight

### Haas Grot Text R — Body, navigation, UI labels, and secondary sans headings — a precise neo-grotesque that keeps product surfaces neutral and readable · `--font-haas-grot-text-r`
- **Substitute:** Inter, Söhne, or Neue Haas Grotesk
- **Weights:** 400, 500, 700
- **Sizes:** 12, 13, 14, 16, 19, 24px
- **Line height:** 1.20–1.43
- **Letter spacing:** 0.25px at 12px, 0.20px at 13px, 0.15px at 14px, -0.34px at 16px, 0.22px at 24px
- **Role:** Body, navigation, UI labels, and secondary sans headings — a precise neo-grotesque that keeps product surfaces neutral and readable

### Haas Grot Disp R — Display-weight sans variant for bold sans headlines — secondary to Ivar Text, used when a sans display is preferred over the serif · `--font-haas-grot-disp-r`
- **Substitute:** Inter, Söhne, or Helvetica Neue
- **Weights:** 400
- **Sizes:** 48, 64px
- **Line height:** 1.00
- **Letter spacing:** -0.48px at 48px, -0.26px at 64px
- **Role:** Display-weight sans variant for bold sans headlines — secondary to Ivar Text, used when a sans display is preferred over the serif

### Haas Grot Text R Web 55 Roman — Haas Grot Text R Web 55 Roman — detected in extracted data but not described by AI · `--font-haas-grot-text-r-web-55-roman`
- **Weights:** 400
- **Sizes:** 12px, 13px, 14px, 16px, 24px
- **Line height:** 1.2, 1.33, 1.38, 1.4, 1.43
- **Letter spacing:** -0.021, 0.009, 0.011, 0.015, 0.021
- **Role:** Haas Grot Text R Web 55 Roman — detected in extracted data but not described by AI

### Haas Grot Text R Web 65 Medium — Haas Grot Text R Web 65 Medium — detected in extracted data but not described by AI · `--font-haas-grot-text-r-web-65-medium`
- **Weights:** 400
- **Sizes:** 14px, 16px
- **Line height:** 1.25, 1.38, 1.43
- **Letter spacing:** 0.009, 0.011, 0.013
- **Role:** Haas Grot Text R Web 65 Medium — detected in extracted data but not described by AI

### Ivar Text Regular — Ivar Text Regular — detected in extracted data but not described by AI · `--font-ivar-text-regular`
- **Weights:** 400
- **Sizes:** 20px, 24px, 48px, 64px, 72px
- **Line height:** 1, 1.33, 1.4
- **Letter spacing:** -0.01, -0.004, 0.003
- **Role:** Ivar Text Regular — detected in extracted data but not described by AI

### Haas Grot Text R Web 75 Bold — Haas Grot Text R Web 75 Bold — detected in extracted data but not described by AI · `--font-haas-grot-text-r-web-75-bold`
- **Weights:** 400
- **Sizes:** 14px, 16px, 24px
- **Line height:** 1.2, 1.38, 1.43
- **Letter spacing:** -0.021, 0.009, 0.011
- **Role:** Haas Grot Text R Web 75 Bold — detected in extracted data but not described by AI

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 12px | 1.2 | 0.25px | `--text-caption` |
| body-sm | 14px | 1.43 | 0.15px | `--text-body-sm` |
| body | 16px | 1.38 | -0.34px | `--text-body` |
| subheading | 20px | 1.4 | -0.2px | `--text-subheading` |
| heading-sm | 24px | 1.33 | 0.07px | `--text-heading-sm` |
| heading | 48px | 1 | -0.48px | `--text-heading` |
| heading-lg | 64px | 1 | -0.26px | `--text-heading-lg` |
| display | 72px | 1 | -0.29px | `--text-display` |

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
| 32 | 32px | `--spacing-32` |
| 40 | 40px | `--spacing-40` |
| 60 | 60px | `--spacing-60` |
| 64 | 64px | `--spacing-64` |
| 100 | 100px | `--spacing-100` |
| 120 | 120px | `--spacing-120` |
| 128 | 128px | `--spacing-128` |

### Border Radius

| Element | Value |
|---------|-------|
| nav | 4px |
| tags | 999px |
| cards | 16px |
| icons | 50px |
| images | 16px |
| buttons | 40px |

### Shadows

| Name | Value | Token |
|------|-------|-------|
| sm | `rgba(0, 0, 0, 0.04) 0px 4px 4px 0px, rgba(0, 0, 0, 0.05) ...` | `--shadow-sm` |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 80-120px
- **Card padding:** 32px
- **Element gap:** 8-16px

## Components

### Announcement Banner
**Role:** Full-width promotional strip above the navigation

Full-width #1070ff band, ~44px tall, centered 14px Haas Grot Text in #ffffff, with an optional inline link underlined. Used sparingly for product news.

### Primary Navigation Bar
**Role:** Sticky dark header with brand, links, and CTA

#14171f background, ~64px tall, sticky. White logotype left, white 14px Haas Grot Text nav links centered, blue filled CTA button (#1070ff, white text, 40px radius) right. No visible bottom border.

### Primary CTA Button
**Role:** Filled action button for trial signup and demo requests

#1070ff background, #ffffff text, 40px border-radius (pill shape), 12px vertical / 24px horizontal padding, 14px Haas Grot Text weight 700, 0.15px letter-spacing. No drop shadow. Used on both dark and light backgrounds.

### Ghost Button
**Role:** Secondary outlined action paired with the primary CTA

Transparent background, 1.5px #ffffff border, #ffffff text, 40px border-radius, 12px 24px padding, 14px Haas Grot Text weight 700. Sits beside the filled CTA in the hero. On light backgrounds, border and text switch to Charcoal #252525.

### Hero Panel
**Role:** Dark above-the-fold showcase section

Full-width #14171f background, ~560–640px tall. Left column: 64–72px Ivar Text weight 400 headline in #ffffff with -0.26 to -0.29px tracking, 18px body text in #ffffff at 70% opacity, CTA pair below. Right column: product screenshot card floating on the six-layer diffuse shadow.

### Product Screenshot Card
**Role:** Embedded app capture treated as primary visual content

16px border-radius, overflow hidden, sits on the six-layer diffuse shadow stack. White interior, 1px Onyx border at 8% opacity. The product UI itself uses white surfaces, hairline borders, and small green/blue/violet data accents.

### Logo Strip
**Role:** Social proof band of client logos

Full-width #14171f band, ~80–100px tall, centered horizontal row of 8–10 client logos in #ffffff at 60% opacity, evenly spaced with 40–60px gaps.

### Feature Section
**Role:** Editorial product feature block with eyebrow, headline, screenshot, and bullet list

#ffffff or #f9f8f7 background, max-width 1200px centered. Blue 12px uppercase eyebrow (#1070ff, 0.25px tracking), 48–64px Ivar Text headline in Charcoal #252525, product screenshot card on one side, 16px Haas Grot Text bullet list on the other. 80–120px vertical padding.

### Eyebrow Label
**Role:** Small uppercase category tag above section headlines

#1070ff color, 12px Haas Grot Text weight 700, uppercase, 0.25px letter-spacing. Sits 16px above the headline. Only chromatic text in the system besides links and CTAs.

### Testimonial Block
**Role:** Full-width quote with attribution

#ffffff background, max-width 900px centered. 24px Ivar Text italic in Charcoal #252525, 40px vertical padding to attribution: 50px circular avatar, 14px Haas Grot Text weight 700 name, 14px regular role in Graphite #6d6b70.

### Dashboard Gauge Card
**Role:** Product UI metric card with semicircular progress gauge

White surface, 16px border-radius, subtle hairline border. Contains a 11px caption label in Graphite, a 24px Ivar Text metric value in Charcoal, and a green (#2dbb6f) gauge arc at 270° representing progress.

### Data Table Row
**Role:** Product UI row in the customer data platform

White background, 14px Haas Grot Text in Charcoal, 1px #000000 border at 6% opacity between rows. Avatar (24px circle), name, organization, MRR value, ticket count, and a 5-dot product score row. 40px row height, 16px horizontal padding.

### Workflow Builder Node
**Role:** Product UI decision node in the journey builder

White card with 12px radius, 1px #000000 border at 8% opacity, purple #533afd diamond icon, 14px Haas Grot Text label, and a YES/NO branch split below. Connected by thin 1px gray lines to child email/SMS action cards.

## Do's and Don'ts

### Do
- Use #1070ff Electric Blue exclusively for primary actions, active states, eyebrow labels, and the announcement band — no other color carries a functional role
- Pair Ivar Text serif at 48–72px with Haas Grot Text sans at 14–16px; the serif-sans contrast is the system's signature typographic move
- Set display headlines with negative tracking (-0.26 to -0.48px) and tight 1.0 line-height so the serif feels cut and editorial, not airy
- Use 40px border-radius for all buttons and tags to maintain the pill-shaped language across every interactive element
- Apply the six-layer diffuse shadow stack only to product screenshot cards and large elevated surfaces — never to buttons, text, or small UI elements
- Alternate between Midnight Ink #14171f panels and Paper White #ffffff sections to create the dark-to-light editorial rhythm
- Keep body copy at 16px Haas Grot Text with 1.38 line-height and -0.34px tracking for compact, readable density

### Don't
- Do not introduce additional chromatic colors — the system is monochrome plus exactly one blue, and a second hue breaks the discipline
- Do not use Ivar Text for body copy, UI labels, or navigation — the serif belongs only at 20px and above, never at functional text sizes
- Do not use square or slightly-rounded buttons — every button is a 40px-radius pill, and sharp corners signal a different product
- Do not apply the diffuse shadow to text, icons, or small elements — it is reserved for large floating surfaces and looks muddy at small scale
- Do not use blue accent text on dark Midnight Ink backgrounds without testing contrast — use #ffffff for body text on dark panels
- Do not break the editorial-print rhythm with full-bleed colored sections or decorative gradients — color appears only as small functional punctuation
- Do not set letter-spacing wider than 0.25px on any text — tracking stays tight or negative throughout the entire type scale

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Paper White | `#ffffff` | Primary page canvas and product screenshot backgrounds |
| 1 | Cream | `#f9f8f7` | Warm-tinted section background for subtle differentiation from pure white |
| 2 | Midnight Ink | `#14171f` | Dark hero, navigation, and logo strip panels |

## Elevation

- **Product Screenshot Card:** `rgba(0, 0, 0, 0.04) 0px 4px 4px 0px, rgba(0, 0, 0, 0.05) 0px 12px 12px 0px, rgba(0, 0, 0, 0.06) 0px 24px 24px 0px, rgba(0, 0, 0, 0.07) 0px 50px 50px 0px, rgba(0, 0, 0, 0.08) 0px 136px 136px 0px, rgba(0, 0, 0, 0.08) 0px 0px 0px 1px`

## Imagery

Product screenshots are the dominant visual element, treated as first-class content rather than decoration: they float on a six-layer diffuse shadow, sit inside 16px-radius white cards, and are clipped with overflow hidden so the product UI fills the frame edge-to-edge. A dark client-logo strip appears once below the hero as social proof. No lifestyle photography, no abstract illustrations, no decorative gradients — the visual language is product UI, monochrome surfaces, and typographic weight.

## Layout

Full-width dark hero at the top with left-aligned serif headline and right-side product screenshot, followed by a dark client-logo strip, then alternating light editorial sections (white and cream #f9f8f7) with a consistent 80–120px vertical rhythm. Each feature section uses a two-column layout: text stack on the left, product screenshot card on the right, max-width 1200px centered. Testimonial blocks break the grid as full-width centered quotes. Navigation is a sticky dark bar above all content, with a blue announcement band stacked above it. No sidebar, no mega-menu, no masonry — every section is either a two-column feature block, a centered quote, or a logo strip.

## Agent Prompt Guide

**Quick Color Reference**
- text: #252525
- background: #ffffff
- border: #000000 (at 6–8% opacity for hairlines)
- accent: #1070ff
- dark surface: #14171f
- muted text: #6d6b70
- primary action: #1070ff (filled action)

**Example Component Prompts**

1. **Hero section**: #14171f background, full-width, ~600px tall. Headline at 64px Ivar Text weight 400, #ffffff, letter-spacing -0.26px. Body at 18px Haas Grot Text weight 400, #ffffff. Blue filled CTA (#1070ff, #ffffff text, 40px radius, 12px 24px padding, 14px weight 700) beside ghost button (transparent, 1.5px #ffffff border, #ffffff text, 40px radius). Product screenshot card on the right (16px radius, white interior, six-layer diffuse shadow).

2. **Feature section**: #ffffff background, max-width 1200px centered, 100px vertical padding. Blue eyebrow (#1070ff, 12px uppercase, weight 700, 0.25px tracking). Headline at 48px Ivar Text weight 400, #252525, letter-spacing -0.48px. Product screenshot card on the right (16px radius, diffuse shadow). Bullet list on the left: 16px Haas Grot Text, #252525, 8px row gap, 2px square markers in #1070ff.

3. **Primary CTA button**: #1070ff background, #ffffff text, 40px border-radius, 12px 24px padding, 14px Haas Grot Text weight 700, 0.15px letter-spacing. No shadow. No hover state change beyond a slight darken to #0d5fd6.

4. **Ghost button**: transparent background, 1.5px #ffffff border, #ffffff text, 40px border-radius, 12px 24px padding, 14px Haas Grot Text weight 700. On light backgrounds, border and text switch to #252525.

5. **Testimonial block**: #ffffff background, max-width 900px centered, 120px vertical padding. Quote at 24px Ivar Text italic, #252525, line-height 1.33. Attribution row below: 50px circular avatar, 14px Haas Grot Text weight 700 name in #252525, 14px regular role in #6d6b70.

## Similar Brands

- **Linear** — Same dark-hero-over-light-body structure with a single vivid accent color and near-zero decoration — both let the product screenshot do the talking
- **Webflow** — Editorial serif headlines paired with clean sans body, and a marketing site that reads like a print designer's portfolio rather than a SaaS template
- **Customer.io** — Marketing automation category peer with the same dark hero, monochrome palette, and blue accent — the products are direct competitors and the visual language reflects that positioning
- **Pitch** — Editorial presentation-product aesthetic: serif display type, generous whitespace, product screenshots treated as primary visuals, and a single accent color held in reserve
- **Vercel** — Black-and-white system with one electric accent, product-forward marketing pages, and the same confidence in letting typography and spacing carry the design without chromatic noise

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-electric-blue: #1070ff;
  --color-midnight-ink: #14171f;
  --color-charcoal: #252525;
  --color-graphite: #6d6b70;
  --color-paper-white: #ffffff;
  --color-cream: #f9f8f7;
  --color-onyx: #000000;

  /* Typography — Font Families */
  --font-sans-serif: 'sans-serif', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-ivar-text: 'Ivar Text', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-haas-grot-text-r: 'Haas Grot Text R', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-haas-grot-disp-r: 'Haas Grot Disp R', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-haas-grot-text-r-web-55-roman: 'Haas Grot Text R Web 55 Roman', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-haas-grot-text-r-web-65-medium: 'Haas Grot Text R Web 65 Medium', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-ivar-text-regular: 'Ivar Text Regular', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-haas-grot-text-r-web-75-bold: 'Haas Grot Text R Web 75 Bold', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.2;
  --tracking-caption: 0.25px;
  --text-body-sm: 14px;
  --leading-body-sm: 1.43;
  --tracking-body-sm: 0.15px;
  --text-body: 16px;
  --leading-body: 1.38;
  --tracking-body: -0.34px;
  --text-subheading: 20px;
  --leading-subheading: 1.4;
  --tracking-subheading: -0.2px;
  --text-heading-sm: 24px;
  --leading-heading-sm: 1.33;
  --tracking-heading-sm: 0.07px;
  --text-heading: 48px;
  --leading-heading: 1;
  --tracking-heading: -0.48px;
  --text-heading-lg: 64px;
  --leading-heading-lg: 1;
  --tracking-heading-lg: -0.26px;
  --text-display: 72px;
  --leading-display: 1;
  --tracking-display: -0.29px;

  /* Typography — Weights */
  --font-weight-regular: 400;
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
  --spacing-40: 40px;
  --spacing-60: 60px;
  --spacing-64: 64px;
  --spacing-100: 100px;
  --spacing-120: 120px;
  --spacing-128: 128px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 80-120px;
  --card-padding: 32px;
  --element-gap: 8-16px;

  /* Border Radius */
  --radius-md: 4px;
  --radius-2xl: 16px;
  --radius-3xl: 24px;
  --radius-3xl-2: 40px;
  --radius-full: 50px;
  --radius-full-2: 999px;

  /* Named Radii */
  --radius-nav: 4px;
  --radius-tags: 999px;
  --radius-cards: 16px;
  --radius-icons: 50px;
  --radius-images: 16px;
  --radius-buttons: 40px;

  /* Shadows */
  --shadow-sm: rgba(0, 0, 0, 0.04) 0px 4px 4px 0px, rgba(0, 0, 0, 0.05) 0px 12px 12px 0px, rgba(0, 0, 0, 0.06) 0px 24px 24px 0px, rgba(0, 0, 0, 0.07) 0px 50px 50px 0px, rgba(0, 0, 0, 0.08) 0px 136px 136px 0px, rgba(0, 0, 0, 0.08) 0px 0px 0px 1px;

  /* Surfaces */
  --surface-paper-white: #ffffff;
  --surface-cream: #f9f8f7;
  --surface-midnight-ink: #14171f;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-electric-blue: #1070ff;
  --color-midnight-ink: #14171f;
  --color-charcoal: #252525;
  --color-graphite: #6d6b70;
  --color-paper-white: #ffffff;
  --color-cream: #f9f8f7;
  --color-onyx: #000000;

  /* Typography */
  --font-sans-serif: 'sans-serif', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-ivar-text: 'Ivar Text', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-haas-grot-text-r: 'Haas Grot Text R', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-haas-grot-disp-r: 'Haas Grot Disp R', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-haas-grot-text-r-web-55-roman: 'Haas Grot Text R Web 55 Roman', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-haas-grot-text-r-web-65-medium: 'Haas Grot Text R Web 65 Medium', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-ivar-text-regular: 'Ivar Text Regular', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-haas-grot-text-r-web-75-bold: 'Haas Grot Text R Web 75 Bold', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.2;
  --tracking-caption: 0.25px;
  --text-body-sm: 14px;
  --leading-body-sm: 1.43;
  --tracking-body-sm: 0.15px;
  --text-body: 16px;
  --leading-body: 1.38;
  --tracking-body: -0.34px;
  --text-subheading: 20px;
  --leading-subheading: 1.4;
  --tracking-subheading: -0.2px;
  --text-heading-sm: 24px;
  --leading-heading-sm: 1.33;
  --tracking-heading-sm: 0.07px;
  --text-heading: 48px;
  --leading-heading: 1;
  --tracking-heading: -0.48px;
  --text-heading-lg: 64px;
  --leading-heading-lg: 1;
  --tracking-heading-lg: -0.26px;
  --text-display: 72px;
  --leading-display: 1;
  --tracking-display: -0.29px;

  /* Spacing */
  --spacing-4: 4px;
  --spacing-8: 8px;
  --spacing-12: 12px;
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-28: 28px;
  --spacing-32: 32px;
  --spacing-40: 40px;
  --spacing-60: 60px;
  --spacing-64: 64px;
  --spacing-100: 100px;
  --spacing-120: 120px;
  --spacing-128: 128px;

  /* Border Radius */
  --radius-md: 4px;
  --radius-2xl: 16px;
  --radius-3xl: 24px;
  --radius-3xl-2: 40px;
  --radius-full: 50px;
  --radius-full-2: 999px;

  /* Shadows */
  --shadow-sm: rgba(0, 0, 0, 0.04) 0px 4px 4px 0px, rgba(0, 0, 0, 0.05) 0px 12px 12px 0px, rgba(0, 0, 0, 0.06) 0px 24px 24px 0px, rgba(0, 0, 0, 0.07) 0px 50px 50px 0px, rgba(0, 0, 0, 0.08) 0px 136px 136px 0px, rgba(0, 0, 0, 0.08) 0px 0px 0px 1px;
}
```
