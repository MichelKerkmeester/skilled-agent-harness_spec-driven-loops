# Loops — Style Reference
> Warm parchment behind a serif headline — like a stationer's print proof lit by afternoon sun.

**Theme:** light

Loops runs a warm, editorial light interface — cream paper (#faf9f7) instead of cold white, a serif display face (Newsreader) that gives marketing screens a magazine-cover gravity, and a single orange (#f97316) that barely appears, like a wax seal on an envelope. The product itself stays almost entirely achromatic: dark pill buttons, hairline stone-toned borders, and flat surfaces with no decorative gradients. Components feel like printed editorial stationery — generous line-height, tight tracking on display, small tags as 999px pills, and elevation reduced to a single hairline inset shadow. An AI agent should treat orange as a signal, not a chrome — it should only fire on the logo, status pips, and small icon accents — while the primary action is always the dark charcoal pill (#1c1917 fill, white text).

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Parchment | `#faf9f7` | `--color-parchment` | Page canvas — the warm off-white that defines the entire experience; never substitute pure #ffffff at the body level |
| Paper | `#ffffff` | `--color-paper` | Card surfaces, code blocks, and inset panels sitting on Parchment |
| Mist | `#f1efef` | `--color-mist` | Subtle secondary surface — hover states on tag pills, tinted code snippet backgrounds, gentle section differentiation without borders |
| Stone-200 | `#e7e5e4` | `--color-stone-200` | Default hairline border — button outlines, card edges, input borders |
| Stone-300 | `#d6d3d1` | `--color-stone-300` | Stronger dividers and hover-borders where more separation is needed |
| Stone-400 | `#a8a29e` | `--color-stone-400` | Muted helper text, disabled labels, icon stroke at rest |
| Stone-500 | `#78716c` | `--color-stone-500` | Secondary text, timestamps, breadcrumb trails |
| Stone-600 | `#57534e` | `--color-stone-600` | Link text at rest, nav labels, mid-priority body text |
| Stone-700 | `#44403c` | `--color-stone-700` | High-emphasis body text, button text on light surfaces |
| Warm Ink | `#1c1917` | `--color-warm-ink` | Primary headings and filled button background — the near-black with a warm cast that harmonizes with Parchment; use instead of #000 for all text and CTA fills |
| Charcoal | `#292524` | `--color-charcoal` | Deep border tone for card hairlines and inset shadows on elevated elements |
| Ember | `#f97316` | `--color-ember` | Orange decorative accent for icons, marks, and small graphic details |

## Tokens — Typography

### sans-serif — sans-serif — detected in extracted data but not described by AI · `--font-sans-serif`
- **Weights:** 400, 600
- **Sizes:** 12px, 16px
- **Line height:** 1.2
- **Role:** sans-serif — detected in extracted data but not described by AI

### Newsreader — Display and headings — a transitional serif with optical sizing. At 80px it carries the hero with -0.04em tracking; at 34px it subtitles feature sections; at 28px it titles cards. This is the signature choice: an editorial serif in a product UI breaks the SaaS sans-serif monotony and signals craft. · `--font-newsreader`
- **Substitute:** Lora, Source Serif Pro, or system 'ui-serif'
- **Weights:** 600
- **Sizes:** 28px, 34px, 80px
- **Line height:** 1.00–1.25
- **Letter spacing:** -0.04em at 80px (-3.2px), -0.03em at 34px (-1.02px), -0.02em at 28px (-0.56px)
- **OpenType features:** `"blwf", "cv03", "cv04", "cv09", "cv11"`
- **Role:** Display and headings — a transitional serif with optical sizing. At 80px it carries the hero with -0.04em tracking; at 34px it subtitles feature sections; at 28px it titles cards. This is the signature choice: an editorial serif in a product UI breaks the SaaS sans-serif monotony and signals craft.

### Inter — Body, UI controls, labels, and links. The default voice for everything that isn't a display headline. 450 is used for slightly heavier body emphasis; 500–600 for button text and nav. · `--font-inter`
- **Substitute:** system 'ui-sans-serif', or Inter from Google Fonts
- **Weights:** 400, 450, 500, 600
- **Sizes:** 12px, 13px, 14px, 15px, 16px, 17px, 19px
- **Line height:** 1.20–1.80
- **Letter spacing:** -0.02em to 0em, with 0.08em reserved for the all-caps pill badge ('CLI now available')
- **OpenType features:** `"blwf", "cv03", "cv04", "cv09", "cv11"`
- **Role:** Body, UI controls, labels, and links. The default voice for everything that isn't a display headline. 450 is used for slightly heavier body emphasis; 500–600 for button text and nav.

### ui-monospace — Code blocks, API endpoints, JSON payloads, and the inline code chip. System monospace keeps the engineering texture without importing a web font. · `--font-ui-monospace`
- **Substitute:** JetBrains Mono, Fira Code, system monospace
- **Weights:** 400, 500
- **Sizes:** 14px, 16px
- **Line height:** 1.20–1.78
- **Role:** Code blocks, API endpoints, JSON payloads, and the inline code chip. System monospace keeps the engineering texture without importing a web font.

### ui-sans-serif — ui-sans-serif — detected in extracted data but not described by AI · `--font-ui-sans-serif`
- **Weights:** 400, 500, 600, 700
- **Sizes:** 12px, 13px, 14px, 15px, 16px, 17px
- **Line height:** 1, 1.2, 1.25, 1.3, 1.35
- **Letter spacing:** -0.02, -0.015, 0.01
- **Role:** ui-sans-serif — detected in extracted data but not described by AI

### Iowan Old Style — Iowan Old Style — detected in extracted data but not described by AI · `--font-iowan-old-style`
- **Weights:** 400
- **Sizes:** 20px
- **Line height:** 1.45
- **Role:** Iowan Old Style — detected in extracted data but not described by AI

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 12px | 1.3 | 0.96px | `--text-caption` |
| body-sm | 14px | 1.4 | — | `--text-body-sm` |
| body-lg | 17px | 1.6 | — | `--text-body-lg` |
| subheading | 20px | 1.45 | — | `--text-subheading` |
| heading | 28px | 1.25 | -0.56px | `--text-heading` |
| heading-lg | 34px | 1.2 | -1.02px | `--text-heading-lg` |
| display | 80px | 1 | -3.2px | `--text-display` |

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
| 24 | 24px | `--spacing-24` |
| 28 | 28px | `--spacing-28` |
| 32 | 32px | `--spacing-32` |
| 36 | 36px | `--spacing-36` |
| 40 | 40px | `--spacing-40` |
| 48 | 48px | `--spacing-48` |
| 108 | 108px | `--spacing-108` |
| 140 | 140px | `--spacing-140` |
| 180 | 180px | `--spacing-180` |

### Border Radius

| Element | Value |
|---------|-------|
| code | 8px |
| tags | 999px |
| cards | 8px |
| inputs | 8px |
| modals | 12px |
| buttons | 999px |

### Shadows

| Name | Value | Token |
|------|-------|-------|
| sm | `rgba(0, 0, 0, 0.05) 0px 1px 4px 0px, rgba(0, 0, 0, 0.03) ...` | `--shadow-sm` |
| subtle | `rgba(255, 255, 255, 0.07) 0px 1px 0px 0px inset, rgba(255...` | `--shadow-subtle` |
| subtle-2 | `rgb(214, 211, 209) 0px 0px 0px 1px inset` | `--shadow-subtle-2` |
| subtle-3 | `rgb(231, 229, 228) 0px 0px 0px 1px inset` | `--shadow-subtle-3` |
| subtle-4 | `rgba(0, 0, 0, 0.04) 0px 1px 2px 0px, rgba(0, 0, 0, 0.03) ...` | `--shadow-subtle-4` |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 80px
- **Card padding:** 32px
- **Element gap:** 12px

## Components

### Filled Pill Button
**Role:** Primary action — the only filled button in the system

999px radius, 8px vertical × 16px horizontal padding, Warm Ink (#1c1917) background, Paper (#ffffff) text, Inter weight 500 at 14px. No shadow. Used for the single most important action per surface.

### Ghost Pill Button
**Role:** Secondary action

999px radius, 8px × 16px padding, transparent background, 1px Stone-200 (#e7e5e4) border, Stone-700 (#44403c) text at Inter 500/14px. Sits beside the filled primary on hero and feature blocks.

### Text Link
**Role:** Inline or standalone link

Inter 400/16px, Stone-600 (#57534c) with a 1px Stone-300 (#d6d3d1) underline or no underline depending on context. Hover lifts to Warm Ink.

### Pill Tag
**Role:** Category labels, topic chips, learn-section links

999px radius, 6px vertical × 13px horizontal padding, Mist (#f1efef) background, Stone-600 text at Inter 400/13px. Borderless at rest; gains Stone-200 border on hover.

### Status Badge
**Role:** Ephemeral notices — 'CLI now available', beta labels, version tags

999px radius, 5px × 12px padding, Parchment (#faf9f7) background with 1px Stone-200 border, Stone-600 text at Inter 600/12px in all-caps with 0.08em tracking. Ember dot prefix for live indicators.

### Editorial Card
**Role:** Feature explanation block — the dominant content unit

8px radius, 32px padding, Paper (#ffffff) background, 1px Stone-200 border, hairline shadow. Contains a Newsreader heading-lg (34px), Inter body-lg (17px), and a row of Pill Tags at the foot.

### Code Preview Block
**Role:** API examples, JSON payloads, terminal snippets

8px radius, 24px padding, Paper background, 1px Stone-200 border. ui-monospace at 14px/1.78, Stone-700 text. Language label pill in the top-right corner. A subtle right-side gutter shows framework logos.

### Email Preview Frame
**Role:** Inline email rendering — the product's signature visual

8px radius, 24px padding, Paper background, 1px Stone-200 border. Contains a faux email header (sender name in Inter 500, email in Stone-500), two Stone-300 placeholder lines for body, and a Warm Ink filled button as the CTA — mirrors a real inbox card.

### Property Row
**Role:** Label-value pairs in the design explanation panel

Two-column row inside an Editorial Card. Left: Stone-500 text in Inter 400/16px. Right: monospace value in Mist-filled 6px-padded chip. 12px vertical row gap; 1px Stone-200 bottom border per row.

### Top Navigation Bar
**Role:** Global header

Transparent over Parchment. Left: small Ember circular logo + stacked Inter nav links at 14px (Guides, Pricing, Docs). Right: Ghost 'Log in' and Filled 'Start' pill. No background fill, no shadow — sits on the canvas directly.

### Logo Wordmark Lockup
**Role:** Brand mark

8px × 8px Ember (#f97316) filled circle with a subtle internal letterform, positioned above the nav stack. The only place Ember appears at meaningful size in the chrome.

### Customer Logo Strip
**Role:** Social proof row

Single horizontal row of customer names in Inter 400/14px Stone-500, separated by 1px Stone-200 vertical dividers at 12px gaps. No logos, no treatments — pure typographic trust signal.

### Help Button
**Role:** Persistent utility

Floating bottom-right, 32px circle, Paper background with 1px Stone-200 border, '?' glyph in Inter 500/14px Stone-500. No shadow.

## Do's and Don'ts

### Do
- Use #faf9f7 as the page canvas — never substitute pure #ffffff at the body level
- Set display headlines in Newsreader 600 at 80px with -3.2px tracking; this is the editorial signature
- Use the 999px pill radius for every button, tag, and badge — there are no rounded-rect buttons in this system
- Reserve #f97316 for the logo, status dots, and single-character icon highlights; never paint it onto buttons or large fills
- Express elevation with a 1px Stone-200 border and an optional hairline shadow at ≤0.05 alpha — avoid layered drop shadows
- Center hero content at a 1200px max-width with 80px section gaps between feature blocks
- Place the filled Warm Ink button beside exactly one Ghost pill on any action cluster

### Don't
- Do not use the bright orange #f97316 as a CTA or link color — the filled action is always Warm Ink #1c1917
- Do not introduce gradients, glows, or blur effects — the palette is flat and printed
- Do not use a sans-serif for the hero headline — Newsreader carries the brand and removing it collapses the editorial identity
- Do not use corners sharper than 8px on cards or wider than 8px on inputs — the two-radius system (8px / 999px) is the whole geometry
- Do not stack multiple shadows on a single card — one hairline border is the maximum depth
- Do not use pure #000 for body text — Warm Ink #1c1917 keeps the type harmonized with the warm canvas
- Do not place logos or decorative imagery in the customer trust strip — the typographic-only row is intentional restraint

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Canvas | `#faf9f7` | Page background — warm off-white, the dominant field |
| 1 | Card | `#ffffff` | Elevated content blocks, code containers, preview windows |
| 2 | Hover Tile | `#f1efef` | Hover and selected states on flat lists, tag backgrounds at rest |
| 3 | Edge | `#e7e5e4` | Hairline borders and inset panel edges — defined by 1px lines, not fills |

## Elevation

- **Card / preview container:** `rgba(0, 0, 0, 0.05) 0px 1px 4px 0px, rgba(0, 0, 0, 0.03) 0px 0px 0px 0.5px`
- **Floating popover / command palette:** `rgba(255, 255, 255, 0.07) 0px 1px 0px 0px inset, rgba(255, 255, 255, 0.06) 0px 0px 0px 1px inset, rgba(0, 0, 0, 0.25) 0px 1px 2px 0px, rgba(0, 0, 0, 0.15) 0px 2px 6px 0px`
- **Inset panel divider:** `rgb(214, 211, 209) 0px 0px 0px 1px inset`
- **Button inner edge:** `rgb(231, 229, 228) 0px 0px 0px 1px inset`

## Imagery

No photography, no illustration, no product screenshots. The site is pure UI: a hero headline, a row of customer names, and feature blocks built from inline components (email preview cards, code snippets, property tables). The brand logo is a single 8px Ember dot. Every 'image' is a component mockup that shows the product's output (an email card, an API call) rather than a screenshot of the product itself.

## Layout

Max-width 1200px centered, with hero content centered within an ~800px column. The hero is a single centered headline stack: Ember logo → status badge → 80px serif headline → 17px subtext → two-button row → customer name strip. Below the fold, feature sections alternate between a left-aligned heading + right-aligned preview, and a centered heading with a full-width inline component below. All feature blocks share 80px vertical gaps and sit directly on the Parchment canvas without section-dividing bands. Navigation is a minimal top bar with a small left-side wordmark stack and two right-side pill buttons — no sticky behavior, no sidebar.

## Agent Prompt Guide

## Quick Color Reference
- text: #1c1917 (Warm Ink) for headings and primary copy
- background: #faf9f7 (Parchment) for page, #ffffff (Paper) for cards
- border: #e7e5e4 (Stone-200) for hairlines
- accent: #f97316 (Ember) for logo and status dots only
- muted text: #78716c (Stone-500) for secondary, #a8a29e (Stone-400) for helper text
- primary action: no distinct CTA color

## 3-5 Example Component Prompts
1. **Hero headline**: Center on #faf9f7 canvas. Text in Newsreader weight 600, 80px, color #1c1917, letter-spacing -3.2px, line-height 1.0. Below, a 17px Inter weight 400 line in #57534e.

No distinct primary action color was observed; use the extracted neutral button treatments instead of inventing a filled CTA color.

3. **Ghost secondary button**: 999px radius, 8px × 16px padding, transparent background, 1px #e7e5e4 border, text #44403c in Inter 500/14px.

4. **Editorial feature card**: 8px radius, 32px padding, background #ffffff, 1px #e7e5e4 border. Heading in Newsreader 600 at 34px, #1c1917, letter-spacing -1.02px. Body in Inter 400/17px, #44403c. Footer row of pill tags: 999px radius, 6px × 13px padding, #f1efef background, #57534e text at Inter 400/13px.

5. **Code preview block**: 8px radius, 24px padding, background #ffffff, 1px #e7e5e4 border. Content in ui-monospace 14px, line-height 1.78, color #44403c. Keyword tokens (e.g. 'POST') in #92400e, string tokens (e.g. email addresses) in #a16207 — these are syntax colors inside the snippet, not brand colors.

## Similar Brands

- **ConvertKit** — Same warm-light editorial feel with serif display headlines and a near-monochrome palette
- **Resend** — Developer-focused email product with a single accent color and pill-shaped controls
- **Plausible Analytics** — Achromatic light surfaces, hairline borders, and a single warm color used only on tiny accents
- **Cal.com** — Mixed serif-and-sans type pairing on a cream canvas, with pill buttons and flat elevation

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-parchment: #faf9f7;
  --color-paper: #ffffff;
  --color-mist: #f1efef;
  --color-stone-200: #e7e5e4;
  --color-stone-300: #d6d3d1;
  --color-stone-400: #a8a29e;
  --color-stone-500: #78716c;
  --color-stone-600: #57534e;
  --color-stone-700: #44403c;
  --color-warm-ink: #1c1917;
  --color-charcoal: #292524;
  --color-ember: #f97316;

  /* Typography — Font Families */
  --font-sans-serif: 'sans-serif', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-newsreader: 'Newsreader', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-inter: 'Inter', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-ui-monospace: 'ui-monospace', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  --font-ui-sans-serif: 'ui-sans-serif', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-iowan-old-style: 'Iowan Old Style', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.3;
  --tracking-caption: 0.96px;
  --text-body-sm: 14px;
  --leading-body-sm: 1.4;
  --text-body-lg: 17px;
  --leading-body-lg: 1.6;
  --text-subheading: 20px;
  --leading-subheading: 1.45;
  --text-heading: 28px;
  --leading-heading: 1.25;
  --tracking-heading: -0.56px;
  --text-heading-lg: 34px;
  --leading-heading-lg: 1.2;
  --tracking-heading-lg: -1.02px;
  --text-display: 80px;
  --leading-display: 1;
  --tracking-display: -3.2px;

  /* Typography — Weights */
  --font-weight-regular: 400;
  --font-weight-w450: 450;
  --font-weight-medium: 500;
  --font-weight-semibold: 600;
  --font-weight-bold: 700;

  /* Spacing */
  --spacing-unit: 4px;
  --spacing-4: 4px;
  --spacing-8: 8px;
  --spacing-12: 12px;
  --spacing-16: 16px;
  --spacing-24: 24px;
  --spacing-28: 28px;
  --spacing-32: 32px;
  --spacing-36: 36px;
  --spacing-40: 40px;
  --spacing-48: 48px;
  --spacing-108: 108px;
  --spacing-140: 140px;
  --spacing-180: 180px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 80px;
  --card-padding: 32px;
  --element-gap: 12px;

  /* Border Radius */
  --radius-lg: 8px;
  --radius-xl: 12px;
  --radius-full: 999px;

  /* Named Radii */
  --radius-code: 8px;
  --radius-tags: 999px;
  --radius-cards: 8px;
  --radius-inputs: 8px;
  --radius-modals: 12px;
  --radius-buttons: 999px;

  /* Shadows */
  --shadow-sm: rgba(0, 0, 0, 0.05) 0px 1px 4px 0px, rgba(0, 0, 0, 0.03) 0px 0px 0px 0.5px;
  --shadow-subtle: rgba(255, 255, 255, 0.07) 0px 1px 0px 0px inset, rgba(255, 255, 255, 0.06) 0px 0px 0px 1px inset, rgba(0, 0, 0, 0.25) 0px 1px 2px 0px, rgba(0, 0, 0, 0.15) 0px 2px 6px 0px;
  --shadow-subtle-2: rgb(214, 211, 209) 0px 0px 0px 1px inset;
  --shadow-subtle-3: rgb(231, 229, 228) 0px 0px 0px 1px inset;
  --shadow-subtle-4: rgba(0, 0, 0, 0.04) 0px 1px 2px 0px, rgba(0, 0, 0, 0.03) 0px 1px 4px 0px;

  /* Surfaces */
  --surface-canvas: #faf9f7;
  --surface-card: #ffffff;
  --surface-hover-tile: #f1efef;
  --surface-edge: #e7e5e4;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-parchment: #faf9f7;
  --color-paper: #ffffff;
  --color-mist: #f1efef;
  --color-stone-200: #e7e5e4;
  --color-stone-300: #d6d3d1;
  --color-stone-400: #a8a29e;
  --color-stone-500: #78716c;
  --color-stone-600: #57534e;
  --color-stone-700: #44403c;
  --color-warm-ink: #1c1917;
  --color-charcoal: #292524;
  --color-ember: #f97316;

  /* Typography */
  --font-sans-serif: 'sans-serif', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-newsreader: 'Newsreader', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-inter: 'Inter', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-ui-monospace: 'ui-monospace', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  --font-ui-sans-serif: 'ui-sans-serif', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-iowan-old-style: 'Iowan Old Style', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.3;
  --tracking-caption: 0.96px;
  --text-body-sm: 14px;
  --leading-body-sm: 1.4;
  --text-body-lg: 17px;
  --leading-body-lg: 1.6;
  --text-subheading: 20px;
  --leading-subheading: 1.45;
  --text-heading: 28px;
  --leading-heading: 1.25;
  --tracking-heading: -0.56px;
  --text-heading-lg: 34px;
  --leading-heading-lg: 1.2;
  --tracking-heading-lg: -1.02px;
  --text-display: 80px;
  --leading-display: 1;
  --tracking-display: -3.2px;

  /* Spacing */
  --spacing-4: 4px;
  --spacing-8: 8px;
  --spacing-12: 12px;
  --spacing-16: 16px;
  --spacing-24: 24px;
  --spacing-28: 28px;
  --spacing-32: 32px;
  --spacing-36: 36px;
  --spacing-40: 40px;
  --spacing-48: 48px;
  --spacing-108: 108px;
  --spacing-140: 140px;
  --spacing-180: 180px;

  /* Border Radius */
  --radius-lg: 8px;
  --radius-xl: 12px;
  --radius-full: 999px;

  /* Shadows */
  --shadow-sm: rgba(0, 0, 0, 0.05) 0px 1px 4px 0px, rgba(0, 0, 0, 0.03) 0px 0px 0px 0.5px;
  --shadow-subtle: rgba(255, 255, 255, 0.07) 0px 1px 0px 0px inset, rgba(255, 255, 255, 0.06) 0px 0px 0px 1px inset, rgba(0, 0, 0, 0.25) 0px 1px 2px 0px, rgba(0, 0, 0, 0.15) 0px 2px 6px 0px;
  --shadow-subtle-2: rgb(214, 211, 209) 0px 0px 0px 1px inset;
  --shadow-subtle-3: rgb(231, 229, 228) 0px 0px 0px 1px inset;
  --shadow-subtle-4: rgba(0, 0, 0, 0.04) 0px 1px 2px 0px, rgba(0, 0, 0, 0.03) 0px 1px 4px 0px;
}
```
