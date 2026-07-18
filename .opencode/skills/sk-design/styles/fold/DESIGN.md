# Fold — Style Reference
> Bauhaus poster on fog

**Theme:** light

Fold's visual language is a bright, spacious fintech workspace built on a cool-tinted near-white canvas. Deep midnight navy (#20294c) carries the weight of authority in headlines and body text, while a softer cornflower (#375390) handles borders, icons, and secondary surfaces. The interface stays predominantly achromatic with a single electric blue accent (#459af8) for interactive elements and links. Cards float on generous white surfaces with soft, large-radius shadows tinted in navy rather than gray — the shadows themselves are on-brand. Typography is confidently large: the hero headline at 100px with extreme negative tracking makes the page feel like a poster rather than a web app, while everything else stays calm and geometric through GT Walsheim Pro's rounded forms. The mood is honest and confrontational, reinforced by the illustration style of 3D-ish lifestyle objects (pizza, popcorn, phone) rendered with crisp edges and minimal backgrounds.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Midnight Navy | `#20294c` | `--color-midnight-navy` | Violet text accent for links, tags, and emphasized short phrases. Do not promote it to the primary CTA color |
| Cornflower Steel | `#375390` | `--color-cornflower-steel` | Borders, icon strokes, secondary text, tag outlines — a desaturated cousin of midnight used for structural elements that recede from primary copy |
| Electric Blue | `#459af8` | `--color-electric-blue` | Inline links, active nav text, small accent dots — the only high-chroma blue, used sparingly to signal clickable moments |
| Fog White | `#f0f1f5` | `--color-fog-white` | Page canvas, subtle card fills, list backgrounds, nav backdrop — the off-white base layer that gives the navy its depth |
| Pure White | `#ffffff` | `--color-pure-white` | Card surfaces, button text on dark fills, elevated panels — the topmost surface that sits above fog |
| Silver Lining | `#c7cbdb` | `--color-silver-lining` | Hairline borders, inactive dividers, muted list separators — cool-tinted gray that vanishes against fog but defines against white |
| Mist Gray | `#dddfe9` | `--color-mist-gray` | Soft borders on light cards, subtle background washes — a step between fog and silver for layered surfaces |
| Smoke | `#979db5` | `--color-smoke` | Light text on dark surfaces, inverse labels, and high-contrast captions. |
| Dusk | `#676b89` | `--color-dusk` | Secondary headings, icon fills in illustrations, mid-weight body — between smoke and midnight for visual rhythm |
| Abyss | `#042939` | `--color-abyss` | Deepest accent, used in illustration borders and dark-image frames — almost black but with a navy cast |
| Voltage Yellow | `#ffff00` | `--color-voltage-yellow` | Rare highlight on a single featured card or callout — used once or twice per page maximum as a visual shock |
| Hyacinth | `#788dba` | `--color-hyacinth` | Outlined action border, rarely used — a lighter cornflower for ghost buttons that need a subtle border presence |

## Tokens — Typography

### GT Walsheim Pro — Primary typeface across all UI. Geometric humanist sans with generous x-height and subtly rounded terminals. Weight 700 at 100px powers the poster-scale hero headline; weight 600 handles subheadings; weight 400 carries body, captions, and UI labels. The 100px hero with -0.125em tracking is the signature — it compresses the headline into a dense, intentional block rather than a airy web headline. · `--font-gt-walsheim-pro`
- **Substitute:** Inter, Switzer, Satoshi, General Sans
- **Weights:** 400, 600, 700
- **Sizes:** 10, 14, 16, 17, 18, 20, 24, 26, 32, 64, 100
- **Line height:** 0.85–1.75
- **Letter spacing:** -0.125em at 100px (hero display), -0.040em at 64px, -0.030em at 32–24px, +0.025em at 10–14px (caps labels), +0.040em at 10px (uppercase tags)
- **Role:** Primary typeface across all UI. Geometric humanist sans with generous x-height and subtly rounded terminals. Weight 700 at 100px powers the poster-scale hero headline; weight 600 handles subheadings; weight 400 carries body, captions, and UI labels. The 100px hero with -0.125em tracking is the signature — it compresses the headline into a dense, intentional block rather than a airy web headline.

### GT America — Secondary typeface for specific heading or display moments where a more compressed, neo-grotesque tone is needed. Used sparingly. · `--font-gt-america`
- **Substitute:** Inter, Söhne, NB International Pro
- **Weights:** 400, 500
- **Sizes:** 24, 42
- **Line height:** 1.00, 1.50
- **Role:** Secondary typeface for specific heading or display moments where a more compressed, neo-grotesque tone is needed. Used sparingly.

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| tag | 10px | 1.2 | 0.4px | `--text-tag` |
| caption | 14px | 1.43 | 0.35px | `--text-caption` |
| body-sm | 16px | 1.5 | — | `--text-body-sm` |
| body | 18px | 1.41 | -0.54px | `--text-body` |
| subheading | 24px | 1.33 | -0.72px | `--text-subheading` |
| heading-sm | 32px | 1.18 | -0.96px | `--text-heading-sm` |
| heading | 42px | 1 | -1.68px | `--text-heading` |
| heading-lg | 64px | 0.85 | -2.56px | `--text-heading-lg` |
| display | 100px | 0.91 | -12.5px | `--text-display` |

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

### Border Radius

| Element | Value |
|---------|-------|
| nav | 24px |
| tags | 9999px |
| cards | 12px |
| images | 16px |
| panels | 24px |
| buttons | 9999px |

### Shadows

| Name | Value | Token |
|------|-------|-------|
| xl | `rgba(32, 41, 76, 0.12) 0px 9px 25px 0px` | `--shadow-xl` |
| md | `rgba(32, 41, 76, 0.12) 0px 6px 16px 0px, rgba(32, 41, 76,...` | `--shadow-md` |
| md-2 | `rgba(32, 41, 76, 0.07) 0px 4px 11px 0px, rgba(32, 41, 76,...` | `--shadow-md-2` |
| subtle | `rgba(255, 255, 255, 0.53) 0px 1px 0px 0px` | `--shadow-subtle` |
| sm | `rgba(32, 41, 76, 0.1) 0px 1px 4px 0px` | `--shadow-sm` |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 48px
- **Card padding:** 24px
- **Element gap:** 8px

## Components

### Filled Pill Button (Primary)
**Role:** Primary call-to-action — used for sign-up, app download, and key conversion moments.

9999px radius. Midnight Navy (#20294c) background, white text. GT Walsheim Pro 16px weight 600, letter-spacing 0. 16px horizontal padding, 12px vertical. Single-shadow lift: rgba(32,41,76,0.1) 0px 1px 4px 0px. No border.

### Outlined Pill Button (Ghost Action)
**Role:** Secondary action — 'See list of banks' and other supportive clicks.

9999px radius. Transparent or white background, Cornflower Steel (#375390) 1.5px border, Cornflower Steel text. Same 16/12 padding as filled variant. No fill, no shadow.

### Hyperlink Text
**Role:** Inline link within body copy.

Electric Blue (#459af8), GT Walsheim Pro 16–18px weight 400, underline on hover only. No background, no padding.

### Default Card (White Surface)
**Role:** Container for bank accounts, transactions, features, and content blocks.

12px border-radius. White (#ffffff) background. Navy-tinted soft shadow: rgba(32,41,76,0.12) 0px 9px 25px 0px. 24px padding on all sides. No border (the shadow defines the edge). Headings inside use Midnight Navy at 24–32px.

### Bank Connection Card
**Role:** Card showing a connected bank with masked account number and bank logo.

12px radius, white background, same shadow stack as default card. Contains a circular bank logo, bank name in Midnight Navy 24px weight 600, 'ACCOUNT NUMBER' label in Smoke 10px uppercase with +0.4px tracking, masked number in Dusk 16px. 16px internal gap between rows.

### Voltage Highlight Card
**Role:** Rare featured callout — used once per page maximum for the most important message.

12px radius, Voltage Yellow (#ffff00) background, Abyss (#042939) text. GT Walsheim Pro 24–32px weight 600. White inner edge highlight: rgba(255,255,255,0.53) 0px 1px 0px 0px. No shadow.

### Category Tag (Pill)
**Role:** Transaction category labels — TRANSPORT, INVESTMENT, FOOD & DRINKS, etc.

9999px radius. Fog White (#f0f1f5) background, Cornflower Steel (#375390) icon, Smoke (#979db5) uppercase text. GT Walsheim Pro 10px weight 600, letter-spacing +0.4px. 8px horizontal, 6px vertical padding. 8px gap between icon and label.

### Section Header (H2)
**Role:** Subsection heading separating content bands.

GT Walsheim Pro 64px weight 700, Midnight Navy, letter-spacing -2.56px, line-height 0.85. Centered on hero, left-aligned in body sections. Often followed by a single supporting sentence at 18px weight 400 in Dusk.

### Hero Display Headline
**Role:** Top-of-page poster headline — brand manifesto line.

GT Walsheim Pro 100px weight 700, Midnight Navy (#20294c), letter-spacing -12.5px, line-height 0.91. Centered, maximum 2 lines. This is the signature: poster-scale, extremely tight tracking, single-color ink. Nothing else on the page competes with this size.

### Merchant Map Pin
**Role:** Location marker on the merchant-detection illustration.

Cornflower Steel (#375390) teardrop pin, no fill on map background. Sits on a light Fog canvas. Static decorative element, not interactive.

### Download QR Code Module
**Role:** App download prompt with QR code and 'Download Fold app — Currently in public beta' label.

Floating card pinned to the bottom-left corner of the page. Mist Gray (#dddfe9) background, 12px radius, 16px padding. QR code 64×64px. Label text in Dusk 14px weight 400.

### Nav Pill (Sticky Top Bar)
**Role:** Top navigation container — wraps the nav links in a pill-shaped bar.

24px border-radius, Fog White background with navy-tinted soft shadow. Internal links in Midnight Navy, active state in Electric Blue. 16px vertical, 32px horizontal padding around the link group.

### Transaction Amount Display
**Role:** Negative transaction amount inside a card (e.g. '−₹385').

GT Walsheim Pro 24px weight 600, Midnight Navy, letter-spacing -0.72px. The minus sign is half-width and tight to the digit — no space gap.

### Illustration Object (3D-style object)
**Role:** Hero illustration: pizza slice, popcorn, phone, shoe, mango, Netflix N, notebook.

Renders with crisp vector edges, subtle inner shadow, and a small contact shadow beneath. No gradient, no glow. Colors are true-to-life (red pizza, green mango, white popcorn bucket with red stripes). Each object floats independently with slight overlap, no background plate.

## Do's and Don'ts

### Do
- Use 100px weight 700 with -0.125em tracking for the hero headline — this is the single signature element and must not be diluted.
- Build shadows with the navy tint rgba(32, 41, 76, 0.12) — neutral gray shadows break the brand and make cards feel detached from the palette.
- Use 12px radius for all cards, 9999px for all interactive pills (buttons, tags, nav). These two radii are the entire shape vocabulary.
- Set page background to Fog White (#f0f1f5) and card surfaces to Pure White — this 5% lightness step is what makes the cards lift without needing heavy borders.
- Use Cornflower Steel (#375390) for all icon strokes, borders, and structural elements; reserve Midnight Navy for text and filled buttons only.
- Keep the electric blue (#459af8) to links and one small accent dot per screen — it should never fill a button or large surface.
- Space sections at 48px and pad cards at 24px — the rhythm is generous, not dense. A cramped Fold page is a broken Fold page.

### Don't
- Do not use yellow (#ffff00) as a text background across more than one card per page — the shock value comes from scarcity.
- Do not set headlines in weight 400 — the 700 weight at 100px is what gives the poster authority; light weights make it look unfinished.
- Do not introduce a new border-radius — if a surface is not a card (12px) or a pill (9999px), reconsider the design.
- Do not use pure black (#000000) for text — Midnight Navy (#20294c) keeps shadows and text in the same color family.
- Do not add gradients to backgrounds or buttons — the system is strictly flat. Any gradient immediately reads as off-brand.
- Do not center-align body paragraphs longer than 2 lines — keep body copy left-aligned at 18px weight 400 in Dusk.
- Do not stack more than three surface levels (canvas → card → nested) — the navy-tinted shadows compound and muddy the hierarchy.

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Fog Canvas | `#f0f1f5` | Page background, primary canvas |
| 1 | Card White | `#ffffff` | Default card surface, elevated panels, button backgrounds |
| 2 | Mist Wash | `#dddfe9` | Nested card or subtle section background |
| 3 | Voltage Pop | `#ffff00` | Sparingly used featured callout surface |

## Elevation

- **Default card:** `rgba(32, 41, 76, 0.12) 0px 9px 25px 0px`
- **Elevated image / hero illustration:** `rgba(32, 41, 76, 0.12) 0px 6px 16px 0px, rgba(32, 41, 76, 0.09) 0px 1px 5px 0px`
- **Nested card / inline panel:** `rgba(32, 41, 76, 0.07) 0px 4px 11px 0px, rgba(32, 41, 76, 0.12) 0px 1px 3px 0px`
- **Button:** `rgba(32, 41, 76, 0.1) 0px 1px 4px 0px`
- **Highlight card top edge:** `rgba(255, 255, 255, 0.53) 0px 1px 0px 0px`

## Imagery

Illustration-first, photography-absent visual language. The hero features a cluster of 3D-style rendered objects (pizza, popcorn bucket, mango, smartphone, Nike shoe, Netflix N, notebook) rendered with crisp vector edges, no outlines, and small soft contact shadows beneath each. Objects overlap slightly and float against the Fog White canvas with no container or background plate. Color treatment is true-to-life rather than duotone or stylized. Secondary visuals include thin-line map illustrations with Cornflower Steel location pins for the merchant-detection feature, and flat outlined phone illustrations showing the bank-connection card emerging from a device frame. Icons throughout the UI are thin-stroke (1.5px) line icons in Cornflower Steel. No photography, no abstract gradients, no decorative patterns — every visual element is either an object, a UI surface, or a thin-line illustration.

## Layout

Max-width 1200px centered content with full-bleed Fog White canvas. Hero is centered: illustration cluster at top, 100px headline below, 18px supporting paragraph, then a narrow vertical gap before the next section. Section rhythm alternates between wide centered bands (hero, closing CTA) and 2-column asymmetric bands (text-left + visual-right, then text-right + visual-left). Cards sit inside max-width containers with 48px vertical gap between sections. The sticky nav is a centered pill (24px radius) floating near the top with generous horizontal padding. A persistent download QR module pins to the bottom-left corner across all scroll positions. The merchant-detection section uses a split composition: thin-line map with pins on the left, a card with the Uber transaction overlapping the map edge, and a flowing grid of category tags on the right. Overall density is spacious — content never exceeds 60% of the viewport width, the rest is breathing room.

## Agent Prompt Guide

Quick Color Reference:
- text: #20294c (Midnight Navy)
- background: #f0f1f5 (Fog White)
- surface/card: #ffffff (Pure White)
- border/hairline: #c7cbdb (Silver Lining)
- accent/link: #459af8 (Electric Blue)
- primary action: #459af8 (filled action)

Example Component Prompts:

1. Hero Display Headline: GT Walsheim Pro 100px weight 700, color #20294c, letter-spacing -12.5px, line-height 0.91, centered. Followed by 18px weight 400 body in #676b89 (Dusk), max-width 560px, also centered.

2. Default Card: white (#ffffff) background, 12px border-radius, 24px padding, shadow rgba(32,41,76,0.12) 0px 9px 25px 0px. No border. Content: 24px heading in Midnight Navy weight 600, 16px body in Dusk weight 400, 8px gap between rows.

3. Category Tag Pill: Fog White (#f0f1f5) background, 9999px radius, 8px horizontal / 6px vertical padding. Cornflower Steel icon at 14px, then 10px uppercase text in Smoke (#979db5) with letter-spacing +0.4px. 8px gap between icon and label.

4. Filled Pill Button: Midnight Navy (#20294c) background, 9999px radius, 16px horizontal / 12px vertical padding. White text in GT Walsheim Pro 16px weight 600. Shadow rgba(32,41,76,0.1) 0px 1px 4px 0px.

5. Sticky Nav Pill: 24px border-radius, Fog White background, 32px horizontal / 16px vertical padding, shadow rgba(32,41,76,0.12) 0px 6px 16px 0px. Nav links in Midnight Navy 16px weight 600, active link in Electric Blue.

## Similar Brands

- **Razorpay** — Same fintech poster-headline approach with deep navy text on near-white canvas and pill-shaped CTAs, though Fold pushes display sizes further.
- **Linear** — Shared discipline of cool-tinted neutrals, generous spacing, and geometric sans typography — Fold is the consumer-facing cousin with more illustration.
- **CRED** — Both use oversized bold headlines on light surfaces with a single accent color and illustration-driven hero sections for a fintech audience.
- **Substack** — Similar serif-free geometric sans, light canvas, and generous whitespace — though Fold adds the cornflower blue secondary and tighter tracking.
- **Wise (TransferWise)** — Same blue-on-white fintech palette and pill button language, though Fold leans darker (midnight navy) where Wise stays in true blue.

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-midnight-navy: #20294c;
  --color-cornflower-steel: #375390;
  --color-electric-blue: #459af8;
  --color-fog-white: #f0f1f5;
  --color-pure-white: #ffffff;
  --color-silver-lining: #c7cbdb;
  --color-mist-gray: #dddfe9;
  --color-smoke: #979db5;
  --color-dusk: #676b89;
  --color-abyss: #042939;
  --color-voltage-yellow: #ffff00;
  --color-hyacinth: #788dba;

  /* Typography — Font Families */
  --font-gt-walsheim-pro: 'GT Walsheim Pro', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-gt-america: 'GT America', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-tag: 10px;
  --leading-tag: 1.2;
  --tracking-tag: 0.4px;
  --text-caption: 14px;
  --leading-caption: 1.43;
  --tracking-caption: 0.35px;
  --text-body-sm: 16px;
  --leading-body-sm: 1.5;
  --text-body: 18px;
  --leading-body: 1.41;
  --tracking-body: -0.54px;
  --text-subheading: 24px;
  --leading-subheading: 1.33;
  --tracking-subheading: -0.72px;
  --text-heading-sm: 32px;
  --leading-heading-sm: 1.18;
  --tracking-heading-sm: -0.96px;
  --text-heading: 42px;
  --leading-heading: 1;
  --tracking-heading: -1.68px;
  --text-heading-lg: 64px;
  --leading-heading-lg: 0.85;
  --tracking-heading-lg: -2.56px;
  --text-display: 100px;
  --leading-display: 0.91;
  --tracking-display: -12.5px;

  /* Typography — Weights */
  --font-weight-regular: 400;
  --font-weight-medium: 500;
  --font-weight-semibold: 600;
  --font-weight-bold: 700;

  /* Spacing */
  --spacing-unit: 8px;
  --spacing-8: 8px;
  --spacing-16: 16px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-48: 48px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 48px;
  --card-padding: 24px;
  --element-gap: 8px;

  /* Border Radius */
  --radius-lg: 8px;
  --radius-xl: 12px;
  --radius-2xl: 16px;
  --radius-2xl-2: 20px;
  --radius-3xl: 24px;
  --radius-3xl-2: 33px;
  --radius-3xl-3: 36px;
  --radius-3xl-4: 40px;
  --radius-full: 9999px;

  /* Named Radii */
  --radius-nav: 24px;
  --radius-tags: 9999px;
  --radius-cards: 12px;
  --radius-images: 16px;
  --radius-panels: 24px;
  --radius-buttons: 9999px;

  /* Shadows */
  --shadow-xl: rgba(32, 41, 76, 0.12) 0px 9px 25px 0px;
  --shadow-md: rgba(32, 41, 76, 0.12) 0px 6px 16px 0px, rgba(32, 41, 76, 0.09) 0px 1px 5px 0px;
  --shadow-md-2: rgba(32, 41, 76, 0.07) 0px 4px 11px 0px, rgba(32, 41, 76, 0.12) 0px 1px 3px 0px;
  --shadow-subtle: rgba(255, 255, 255, 0.53) 0px 1px 0px 0px;
  --shadow-sm: rgba(32, 41, 76, 0.1) 0px 1px 4px 0px;

  /* Surfaces */
  --surface-fog-canvas: #f0f1f5;
  --surface-card-white: #ffffff;
  --surface-mist-wash: #dddfe9;
  --surface-voltage-pop: #ffff00;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-midnight-navy: #20294c;
  --color-cornflower-steel: #375390;
  --color-electric-blue: #459af8;
  --color-fog-white: #f0f1f5;
  --color-pure-white: #ffffff;
  --color-silver-lining: #c7cbdb;
  --color-mist-gray: #dddfe9;
  --color-smoke: #979db5;
  --color-dusk: #676b89;
  --color-abyss: #042939;
  --color-voltage-yellow: #ffff00;
  --color-hyacinth: #788dba;

  /* Typography */
  --font-gt-walsheim-pro: 'GT Walsheim Pro', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-gt-america: 'GT America', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-tag: 10px;
  --leading-tag: 1.2;
  --tracking-tag: 0.4px;
  --text-caption: 14px;
  --leading-caption: 1.43;
  --tracking-caption: 0.35px;
  --text-body-sm: 16px;
  --leading-body-sm: 1.5;
  --text-body: 18px;
  --leading-body: 1.41;
  --tracking-body: -0.54px;
  --text-subheading: 24px;
  --leading-subheading: 1.33;
  --tracking-subheading: -0.72px;
  --text-heading-sm: 32px;
  --leading-heading-sm: 1.18;
  --tracking-heading-sm: -0.96px;
  --text-heading: 42px;
  --leading-heading: 1;
  --tracking-heading: -1.68px;
  --text-heading-lg: 64px;
  --leading-heading-lg: 0.85;
  --tracking-heading-lg: -2.56px;
  --text-display: 100px;
  --leading-display: 0.91;
  --tracking-display: -12.5px;

  /* Spacing */
  --spacing-8: 8px;
  --spacing-16: 16px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-48: 48px;

  /* Border Radius */
  --radius-lg: 8px;
  --radius-xl: 12px;
  --radius-2xl: 16px;
  --radius-2xl-2: 20px;
  --radius-3xl: 24px;
  --radius-3xl-2: 33px;
  --radius-3xl-3: 36px;
  --radius-3xl-4: 40px;
  --radius-full: 9999px;

  /* Shadows */
  --shadow-xl: rgba(32, 41, 76, 0.12) 0px 9px 25px 0px;
  --shadow-md: rgba(32, 41, 76, 0.12) 0px 6px 16px 0px, rgba(32, 41, 76, 0.09) 0px 1px 5px 0px;
  --shadow-md-2: rgba(32, 41, 76, 0.07) 0px 4px 11px 0px, rgba(32, 41, 76, 0.12) 0px 1px 3px 0px;
  --shadow-subtle: rgba(255, 255, 255, 0.53) 0px 1px 0px 0px;
  --shadow-sm: rgba(32, 41, 76, 0.1) 0px 1px 4px 0px;
}
```
