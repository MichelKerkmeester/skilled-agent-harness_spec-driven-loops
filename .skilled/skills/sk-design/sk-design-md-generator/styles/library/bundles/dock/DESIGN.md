# Dock — Style Reference
> Sunlit cream paper, cobalt pulse

**Theme:** light

Dock operates in a sunlit, cream-warm workspace language: a soft #faf9f7 canvas replaces the usual pure-white SaaS backdrop, giving every screen a paper-like, approachable feel. Typography carries the weight — 84px Roobert display headlines sit alongside 16px body text with generous breathing room, letting the copy feel like confident printed prose rather than UI chrome. A single electric cobalt blue (#0068f9) punctuates the calm neutrals as the only interactive color: filled CTAs, active states, and links all share this vivid hue, while a secondary violet (#6736eb) appears sparingly as decorative accent. Components stay featherlight — pill-shaped buttons, hairline borders, soft elevated cards, and zero heavy shadows — so the product screenshots become the visual heroes rather than chrome around them.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Canvas Cream | `#faf9f7` | `--color-canvas-cream` | Page background — warm off-white instead of pure white gives the entire system a paper-like, approachable feel |
| Surface Ivory | `#fbfaf7` | `--color-surface-ivory` | Card and panel surfaces — one step brighter than canvas to create subtle elevation without shadows |
| Pure White | `#ffffff` | `--color-pure-white` | Elevated surfaces, nav background, button text on filled CTAs |
| Lavender Mist | `#f4f0ff` | `--color-lavender-mist` | Decorative wash behind icons or highlight badges — cool counterpoint to the warm cream canvas |
| Powder Blue | `#d6e4f1` | `--color-powder-blue` | Outlined/ghost button border, subtle blue-tinted dividers within product UI |
| Ink Charcoal | `#121722` | `--color-ink-charcoal` | Primary text, headings, icons — near-black with a cool blue undertone (17.9:1 on white) |
| Deep Ink | `#1d1d1d` | `--color-deep-ink` | Secondary text, dark surface fills for footer or dark mode moments |
| Mid Graphite | `#2d2d2d` | `--color-mid-graphite` | Dark surface for dark UI moments (footer dark blocks, modal overlays) |
| Slate Gray | `#777c86` | `--color-slate-gray` | Secondary body text, card metadata, table labels |
| Steel Gray | `#a5a5a5` | `--color-steel-gray` | Muted helper text, placeholder text, disabled states |
| Hairline | `#efefef` | `--color-hairline` | Borders and dividers — barely-there separation between cards and sections |
| Faint Gray | `#cccccc` | `--color-faint-gray` | Icon strokes in nav, subdued borders on neutral controls |
| Electric Cobalt | `#0068f9` | `--color-electric-cobalt` | Violet supporting accent for decorative details and low-frequency emphasis. Do not promote it to the primary CTA color |
| Deep Cobalt | `#024bb1` | `--color-deep-cobalt` | Pressed/hover state for Electric Cobalt buttons — darker shade of the brand blue |
| Cerulean | `#0074dd` | `--color-cerulean` | Blue supporting accent for decorative details and low-frequency emphasis. Do not promote it to the primary CTA color |
| Vivid Violet | `#6736eb` | `--color-vivid-violet` | Decorative accent — secondary brand color for highlight tags, illustrative elements, and customer logo treatments |
| Forest | `#046645` | `--color-forest` | Green supporting accent for decorative details and low-frequency emphasis. Use as a supporting accent, not as a status color |

## Tokens — Typography

### Roobert — All text — single typeface carries the entire system. Headlines use 600–700 at 48–84px with extremely tight leading (1.06–1.09) creating dense, confident type blocks. Body and nav use 400–500 at 14–16px with generous 1.50–1.60 leading for readability on the cream background. · `--font-roobert`
- **Substitute:** Inter (closest open alternative; matches geometric warmth and weight range), or Söhne / GT America if licensed
- **Weights:** 400, 500, 600, 700
- **Sizes:** 13, 14, 15, 16, 18, 20, 24, 40, 48, 57, 84
- **Line height:** 1.06–1.60 (tight at display sizes: 84px→1.06, 57px→1.09; relaxed at body: 16px→1.56)
- **Letter spacing:** 0.077em across tracked elements (uppercase labels, small caps in nav)
- **OpenType features:** `"ss01" on, "kern" on`
- **Role:** All text — single typeface carries the entire system. Headlines use 600–700 at 48–84px with extremely tight leading (1.06–1.09) creating dense, confident type blocks. Body and nav use 400–500 at 14–16px with generous 1.50–1.60 leading for readability on the cream background.

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 13px | 1.5 | 0.077px | `--text-caption` |
| body | 16px | 1.56 | — | `--text-body` |
| subheading | 18px | 1.5 | — | `--text-subheading` |
| heading-sm | 20px | 1.38 | — | `--text-heading-sm` |
| heading | 24px | 1.33 | — | `--text-heading` |
| heading-lg | 40px | 1.25 | — | `--text-heading-lg` |
| heading-xl | 48px | 1.2 | — | `--text-heading-xl` |
| display | 57px | 1.09 | — | `--text-display` |
| display-lg | 84px | 1.06 | — | `--text-display-lg` |

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
| 64 | 64px | `--spacing-64` |
| 80 | 80px | `--spacing-80` |
| 88 | 88px | `--spacing-88` |

### Border Radius

| Element | Value |
|---------|-------|
| cards | 16px |
| icons | 60px |
| pills | 100px |
| images | 16px |
| buttons | 48px |
| navItems | 48px |

### Shadows

| Name | Value | Token |
|------|-------|-------|
| subtle | `rgba(0, 0, 0, 0.07) 0px 1px 1px 0px, rgba(0, 0, 0, 0.04) ...` | `--shadow-subtle` |
| lg | `rgba(0, 0, 0, 0.04) 0px 20px 20px -8px` | `--shadow-lg` |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 80px
- **Card padding:** 24px
- **Element gap:** 8px

## Components

### Primary Filled Button
**Role:** Main conversion action (e.g., Start for Free, Request Demo)

Background #0068f9, text #ffffff, weight 500 at 15–16px. 48px border-radius (pill shape). 12px 24px padding. No visible border. On hover darkens to #024bb1.

### Ghost/Neutral Button
**Role:** Secondary action (e.g., Request Demo beside a filled CTA)

Background #ffffff, text #121722, weight 500 at 15–16px. 48px border-radius. 1px border in #efefef. 12px 24px padding. Sits next to the filled CTA with equal weight, creating a paired-button pattern.

### Text Link
**Role:** Inline navigation within paragraphs or product UI

Color #0074dd or #0068f9, no underline by default, underline on hover. Weight 500 at body size.

### Top Navigation Bar
**Role:** Primary site navigation

Background #ffffff, 1px bottom border in #efefef. Logo left, nav links center (Product, Pricing, Customers, Resources with dropdown chevrons), auth actions right. Nav links at 14–15px weight 500 #121722. Right side has Log in (text) + Request Demo (ghost pill) + Start for Free (filled cobalt pill).

### Hero Section
**Role:** Above-the-fold headline and CTA

Background transitions from #faf9f7 to a soft blue gradient (#d5ecff → #f4f0ff) at the bottom. Headline at 84px weight 600, line-height 1.06, #121722, centered. Subtext at 18px weight 400 #121722, max-width ~640px. Two CTAs centered: ghost Request Demo + filled Start for Free.

### Product Feature Card
**Role:** Showcasing product capabilities (Deal Rooms, Enablement Agent, etc.)

Background #ffffff, 16px border-radius, 1px border in #efefef, subtle multi-layer shadow. Internal padding 24px. Often paired with a product screenshot that overflows the card or sits on a gradient background.

### Tab Bar
**Role:** Switching between product feature areas

Horizontal row of text labels (Deal Rooms, Enablement Agent, AI Documents, etc.). Active tab has #fbfaf7 pill background with 48px radius. Inactive tabs are plain #121722 text. No underlines or borders — the pill background is the only active indicator.

### Customer Stat Card
**Role:** Social proof with metrics (Lattice +25% win rate, BrightHire +22%, Loom 2 hours saved)

Background #fbfaf7 to #ffffff, 16px radius, 1px border #efefef. Company logo + product label at top (14–15px). Large metric at 40–48px weight 600 in #0068f9 (the cobalt) or #6736eb (violet) — color varies per card to add rhythm. No heavy shadow.

### Gradient CTA Banner
**Role:** Final conversion section (Want a deeper tour of Dock?)

Full-width background with a diagonal blue gradient from #faf9f7 through #c8dcf5 to #0068f9 in the lower-right corner. Headline at 48–57px weight 600 #121722, centered. Single filled cobalt button below. The gradient corner is the signature — it bleeds electric blue into the otherwise quiet page.

### Footer
**Role:** Site-wide links and legal

Background #ffffff, 1px top border in #efefef. 6-column grid of link lists (Product, Sales, Enablement, Customer Success, Templates, Resources, General). Section headers at 13–14px weight 600, links at 14px weight 400 #777c86. Logo top-left. Bottom bar with legal links + copyright at 13px #a5a5a5.

### Pricing Table Row
**Role:** Product pricing display within Deal Room UI

Background #ffffff, 1px bottom border #efefef. Column headers at 14px weight 500 #777c86. Data cells at 15–16px weight 400 #121722. Alternating subtle background optional. Total column right-aligned and weight 600.

### Checklist/Step Item
**Role:** Task tracking within product (Success Criteria, Next Steps)

Green circle check icon (#046645) for completed, hollow circle for pending. Text at 15px weight 400 #121722. Compact 6–8px row gap. Optional right-side badge (In Progress, Schedule call) in 8px radius pill with tinted background.

## Do's and Don'ts

### Do
- Use #faf9f7 as the page background — never substitute pure #ffffff for the canvas
- Apply the 48px pill radius to all buttons and the 16px radius to all cards
- Set primary action buttons to #0068f9 fill with #ffffff text at weight 500, 15–16px
- Use 84px Roobert weight 600 for hero headlines with line-height 1.06
- Pair a filled cobalt CTA with a white ghost CTA in hero sections for balanced hierarchy
- Use #efefef for all borders — never heavier than 1px
- Let the electric blue gradient corner appear only in the final CTA banner, not throughout

### Don't
- Don't use #ffffff as the page background — it kills the warm cream paper feel
- Don't use flat shadows (e.g., box-shadow: 0 4px 8px) — the system uses feather-light multi-layer shadows or none
- Don't add a second chromatic color to CTA buttons — #0068f9 is the only filled action color
- Don't set headline line-height above 1.15 — the tight leading at display sizes is signature
- Don't use #6736eb for CTAs or links — it's decorative accent only (tags, highlights, stat numbers)
- Don't add heavy gradients to cards or panels — gradients belong only in the CTA banner and hero background
- Don't use more than 1px borders in #efefef or #d6e4f1 — heavier strokes break the lightweight feel

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Canvas Cream | `#faf9f7` | Page background — base layer for all content |
| 1 | Surface Ivory | `#fbfaf7` | Cards, panels — subtle lift from canvas without shadow |
| 2 | Pure White | `#ffffff` | Elevated cards, nav bar, input fields, button hover |
| 3 | Lavender Mist | `#f4f0ff` | Decorative highlight wash, hero gradient zones |

## Elevation

- **Cards and panels:** `rgba(0, 0, 0, 0.07) 0px 1px 1px 0px, rgba(0, 0, 0, 0.04) 0px -1px 1px 0px inset, rgba(0, 0, 0, 0.14) 0px 0px 0px 0.5px inset`
- **Product screenshot images:** `rgba(0, 0, 0, 0.04) 0px 20px 20px -8px`

## Imagery

Product screenshots are the dominant visual: real interface captures showing Deal Rooms, pricing tables, checklists, and file tabs — not mockups. These are presented in rounded 16px containers, often with a subtle soft shadow (rgba(0,0,0,0.04) 0px 20px 20px -8px) and positioned on a gradient or lavender mist background to make them float. Customer logos (Lattice, BrightHire, Loom) appear as compact marks paired with colored metric numbers. No lifestyle photography, no abstract illustrations, no 3D renders — the product IS the hero. Icons are minimal, monoline-style, used sparingly in nav and status indicators.

## Layout

Full-width page with max-width 1200px centered content. Hero is a centered stack: 84px headline → 18px subtext (max ~640px) → two pill buttons, sitting on a cream-to-blue gradient. Feature sections alternate between full-bleed gradient backgrounds and contained card grids. Product tabs (Deal Rooms, Enablement Agent, etc.) sit as a horizontal pill-bar above a large product screenshot. Social proof uses a 3-column card grid (Lattice / BrightHire / Loom) with company mark + product label + large colored metric. Final CTA is a full-bleed section with a diagonal blue gradient bleeding from the lower-right corner. Footer is a 6-column link grid on white. Vertical rhythm uses 80px section gaps; cards use 24px internal padding with 8px element gaps.

## Agent Prompt Guide

**Quick Color Reference**
- text: #121722
- background: #faf9f7
- card surface: #fbfaf7 or #ffffff
- border: #efefef
- muted text: #777c86 or #a5a5a5
- primary action: no distinct CTA color

**Example Component Prompts**
1. **Hero section**: Background gradient from #faf9f7 (top) to #d5ecff (bottom). Headline at 84px Roobert weight 600, #121722, line-height 1.06, centered. Subtext at 18px weight 400, #121722, max-width 640px. Two CTAs centered: ghost button (#ffffff fill, #121722 text, 1px #efefef border, 48px radius, 12px 24px padding) + filled button (#0068f9 fill, #ffffff text, 48px radius, 12px 24px padding).
2. **Customer stat card**: Background #fbfaf7, 16px radius, 1px border #efefef, 24px padding. Company logo at top (24px tall). Product label at 14px weight 500 #777c86. Large metric at 48px weight 600 in #0068f9. Light shadow: rgba(0,0,0,0.07) 0px 1px 1px 0px + inset border.
3. **Product feature card with screenshot**: Background #ffffff, 16px radius, 1px border #efefef, 24px padding. Tab bar above with active pill (#fbfaf7 fill, 48px radius). Screenshot image at 16px radius, 20px soft shadow below, sitting on a #f4f0ff to #ffffff gradient background.
No distinct primary action color was observed; use the extracted neutral button treatments instead of inventing a filled CTA color.
5. **Tab bar**: Horizontal row on transparent background. 5–7 text labels at 15px weight 500 #121722, spaced 24px apart. Active tab has #fbfaf7 background, 48px radius, 8px 16px padding. No underlines, no borders — pill background is the sole active indicator.

## Radius Language

The system uses an unusually wide radius range that creates a distinct softness: 8px for small UI elements (badges, inline tags), 16px for cards and images, 48px for buttons and active nav states (pill shape), 60px for icon containers (near-circular), and 100px for decorative orbs. The 48px button radius is the most signature choice — it makes every action feel like a physical capsule, not a sharp rectangle. Never use 4px or 6px radii; the system commits fully to softness.

## Shadow Philosophy

Shadows are nearly invisible by design. Cards use a 3-layer micro-shadow (1px drop + 1px inset top + 0.5px inset border) that reads as a subtle outline more than elevation. Product screenshots get a single soft 20px spread shadow at 4% opacity. The system never uses heavy drop shadows, colored shadows, or glow effects. Elevation is communicated through background lightness steps (canvas → ivory → white) rather than shadow depth.

## Similar Brands

- **Linear** — Same single-accent-color discipline (Linear uses purple, Dock uses cobalt) against a warm light background with pill-shaped buttons and large confident type
- **Attio** — Warm cream/off-white canvas rather than pure white, soft rounded cards, single vivid interactive color, generous section spacing
- **Raycast** — Clean light SaaS with pill buttons, product screenshots as heroes, minimal chrome, and a single accent color doing all interactive work
- **Pitch** — Same approach of letting a custom geometric typeface carry the brand, with featherlight components and a gradient hero section as a signature moment
- **Loom** — Warm approachable light theme, rounded everything, and product UI shown as embedded screenshots rather than abstract illustrations

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-canvas-cream: #faf9f7;
  --color-surface-ivory: #fbfaf7;
  --color-pure-white: #ffffff;
  --color-lavender-mist: #f4f0ff;
  --color-powder-blue: #d6e4f1;
  --color-ink-charcoal: #121722;
  --color-deep-ink: #1d1d1d;
  --color-mid-graphite: #2d2d2d;
  --color-slate-gray: #777c86;
  --color-steel-gray: #a5a5a5;
  --color-hairline: #efefef;
  --color-faint-gray: #cccccc;
  --color-electric-cobalt: #0068f9;
  --color-deep-cobalt: #024bb1;
  --color-cerulean: #0074dd;
  --color-vivid-violet: #6736eb;
  --color-forest: #046645;

  /* Typography — Font Families */
  --font-roobert: 'Roobert', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 13px;
  --leading-caption: 1.5;
  --tracking-caption: 0.077px;
  --text-body: 16px;
  --leading-body: 1.56;
  --text-subheading: 18px;
  --leading-subheading: 1.5;
  --text-heading-sm: 20px;
  --leading-heading-sm: 1.38;
  --text-heading: 24px;
  --leading-heading: 1.33;
  --text-heading-lg: 40px;
  --leading-heading-lg: 1.25;
  --text-heading-xl: 48px;
  --leading-heading-xl: 1.2;
  --text-display: 57px;
  --leading-display: 1.09;
  --text-display-lg: 84px;
  --leading-display-lg: 1.06;

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
  --spacing-40: 40px;
  --spacing-48: 48px;
  --spacing-64: 64px;
  --spacing-80: 80px;
  --spacing-88: 88px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 80px;
  --card-padding: 24px;
  --element-gap: 8px;

  /* Border Radius */
  --radius-lg: 8px;
  --radius-2xl: 16px;
  --radius-2xl-2: 20px;
  --radius-3xl: 32px;
  --radius-3xl-2: 40px;
  --radius-full: 48px;
  --radius-full-2: 60px;
  --radius-full-3: 100px;

  /* Named Radii */
  --radius-cards: 16px;
  --radius-icons: 60px;
  --radius-pills: 100px;
  --radius-images: 16px;
  --radius-buttons: 48px;
  --radius-navitems: 48px;

  /* Shadows */
  --shadow-subtle: rgba(0, 0, 0, 0.07) 0px 1px 1px 0px, rgba(0, 0, 0, 0.04) 0px -1px 1px 0px inset, rgba(0, 0, 0, 0.14) 0px 0px 0px 0.5px inset;
  --shadow-lg: rgba(0, 0, 0, 0.04) 0px 20px 20px -8px;

  /* Surfaces */
  --surface-canvas-cream: #faf9f7;
  --surface-surface-ivory: #fbfaf7;
  --surface-pure-white: #ffffff;
  --surface-lavender-mist: #f4f0ff;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-canvas-cream: #faf9f7;
  --color-surface-ivory: #fbfaf7;
  --color-pure-white: #ffffff;
  --color-lavender-mist: #f4f0ff;
  --color-powder-blue: #d6e4f1;
  --color-ink-charcoal: #121722;
  --color-deep-ink: #1d1d1d;
  --color-mid-graphite: #2d2d2d;
  --color-slate-gray: #777c86;
  --color-steel-gray: #a5a5a5;
  --color-hairline: #efefef;
  --color-faint-gray: #cccccc;
  --color-electric-cobalt: #0068f9;
  --color-deep-cobalt: #024bb1;
  --color-cerulean: #0074dd;
  --color-vivid-violet: #6736eb;
  --color-forest: #046645;

  /* Typography */
  --font-roobert: 'Roobert', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 13px;
  --leading-caption: 1.5;
  --tracking-caption: 0.077px;
  --text-body: 16px;
  --leading-body: 1.56;
  --text-subheading: 18px;
  --leading-subheading: 1.5;
  --text-heading-sm: 20px;
  --leading-heading-sm: 1.38;
  --text-heading: 24px;
  --leading-heading: 1.33;
  --text-heading-lg: 40px;
  --leading-heading-lg: 1.25;
  --text-heading-xl: 48px;
  --leading-heading-xl: 1.2;
  --text-display: 57px;
  --leading-display: 1.09;
  --text-display-lg: 84px;
  --leading-display-lg: 1.06;

  /* Spacing */
  --spacing-8: 8px;
  --spacing-16: 16px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-40: 40px;
  --spacing-48: 48px;
  --spacing-64: 64px;
  --spacing-80: 80px;
  --spacing-88: 88px;

  /* Border Radius */
  --radius-lg: 8px;
  --radius-2xl: 16px;
  --radius-2xl-2: 20px;
  --radius-3xl: 32px;
  --radius-3xl-2: 40px;
  --radius-full: 48px;
  --radius-full-2: 60px;
  --radius-full-3: 100px;

  /* Shadows */
  --shadow-subtle: rgba(0, 0, 0, 0.07) 0px 1px 1px 0px, rgba(0, 0, 0, 0.04) 0px -1px 1px 0px inset, rgba(0, 0, 0, 0.14) 0px 0px 0px 0.5px inset;
  --shadow-lg: rgba(0, 0, 0, 0.04) 0px 20px 20px -8px;
}
```
