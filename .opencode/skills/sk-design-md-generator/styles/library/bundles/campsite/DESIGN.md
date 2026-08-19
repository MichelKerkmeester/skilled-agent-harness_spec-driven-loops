# Campsite — Style Reference
> Warm paper workspace — quiet, cream, and product-forward

**Theme:** light

Campsite runs on warm minimalism: a cream-white canvas (#fffdf9) that feels like paper, paired with near-black text and almost no color. The interface is quiet, compact, and confident — Inter at every size, tight tracking on display sizes, pill-shaped controls, and soft elevation that barely lifts off the page. Color is rationed to functional punctuation: green for resolved states, a warm yellow wash for highlights, and a single dark-orange tone that lives in decorative paint-splash branding rather than in the UI itself. The product mockup is the hero — large, full-bleed, and dominant — while surrounding copy stays small and restrained, letting the product speak.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Warm Canvas | `#fffdf9` | `--color-warm-canvas` | Page background — a warm off-white that gives the entire site its paper-like quality |
| Pure White | `#ffffff` | `--color-pure-white` | Card surfaces, elevated panels, and product-screenshot backgrounds |
| Ash Mist | `#f5f5f5` | `--color-ash-mist` | Secondary surface for subtle differentiation — post bodies, sidebar items, input fields |
| Soft Fog | `#f0f0f0` | `--color-soft-fog` | Tertiary surface for nested elements, dividers, and inactive states |
| Ink | `#171717` | `--color-ink` | Primary text, icons, and headings — near-black warmth rather than pure black |
| Graphite | `#525252` | `--color-graphite` | Secondary text and metadata |
| Steel | `#737373` | `--color-steel` | Tertiary text, timestamps, and helper labels |
| Silver | `#a3a3a3` | `--color-silver` | Muted text, placeholders, and inactive icon fills |
| Charcoal Card | `#1e1e1e` | `--color-charcoal-card` | Dark-mode product card surface shown in feature sections |
| Resolve Green | `#22c55e` | `--color-resolve-green` | Green action color for filled buttons, selected navigation states, and focused conversion moments. Use as a supporting accent, not as a status color |
| Highlight Wash | `#fef3c7` | `--color-highlight-wash` | Soft warm-yellow background for highlighted callouts and quote blocks |
| Sienna Brand | `#451a03` | `--color-sienna-brand` | Decorative branding — paint-splash illustrations and brand-icon accents that frame content edges |
| Alert Red | `#ef4444` | `--color-alert-red` | Red action color for filled buttons, selected navigation states, and focused conversion moments. Use as a supporting accent, not as a status color |

## Tokens — Typography

### Inter — Sole typeface for all UI, headings, body, and buttons. The 58px hero headline with weight 600 and -0.031em tracking is the typographic anchor — tight, confident, never thin. Body text settles at 14–16px with weight 400. No display serif or alternate families — the system achieves hierarchy purely through size and weight within Inter. · `--font-inter`
- **Substitute:** system-ui, -apple-system, sans-serif
- **Weights:** 400, 500, 600
- **Sizes:** 10, 11, 12, 13, 14, 15, 16, 17, 18, 20, 22, 29, 58
- **Line height:** 1.00–1.80
- **Letter spacing:** -1.8px at 58px, -0.52px at 29px, -0.27px at 15px, +0.3px at 12px (uppercase badges)
- **OpenType features:** `"cv11", "ss01"`
- **Role:** Sole typeface for all UI, headings, body, and buttons. The 58px hero headline with weight 600 and -0.031em tracking is the typographic anchor — tight, confident, never thin. Body text settles at 14–16px with weight 400. No display serif or alternate families — the system achieves hierarchy purely through size and weight within Inter.

### ui-monospace — ui-monospace — detected in extracted data but not described by AI · `--font-ui-monospace`
- **Weights:** 400, 600
- **Sizes:** 12px
- **Line height:** 1
- **Role:** ui-monospace — detected in extracted data but not described by AI

### emoji — emoji — detected in extracted data but not described by AI · `--font-emoji`
- **Weights:** 500, 600
- **Sizes:** 12px, 14px
- **Line height:** 1
- **Role:** emoji — detected in extracted data but not described by AI

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 11px | 1.4 | — | `--text-caption` |
| body | 15px | 1.56 | -0.27px | `--text-body` |
| body-lg | 18px | 1.63 | — | `--text-body-lg` |
| subheading | 22px | 1.4 | — | `--text-subheading` |
| heading | 29px | 1.33 | -0.52px | `--text-heading` |
| display | 58px | 1.2 | -1.8px | `--text-display` |

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
| 32 | 32px | `--spacing-32` |
| 48 | 48px | `--spacing-48` |
| 64 | 64px | `--spacing-64` |
| 72 | 72px | `--spacing-72` |
| 80 | 80px | `--spacing-80` |
| 96 | 96px | `--spacing-96` |
| 160 | 160px | `--spacing-160` |

### Border Radius

| Element | Value |
|---------|-------|
| tags | 9999px |
| cards | 12px |
| images | 8px |
| inputs | 8px |
| avatars | 9999px |
| buttons | 9999px |

### Shadows

| Name | Value | Token |
|------|-------|-------|
| sm | `rgba(0, 0, 0, 0.05) 0px 3px 6px -3px, rgba(0, 0, 0, 0.05)...` | `--shadow-sm` |
| subtle | `rgba(0, 0, 0, 0.08) 0px 1px 1px -1px, rgba(0, 0, 0, 0.08)...` | `--shadow-subtle` |
| subtle-2 | `rgba(0, 0, 0, 0.05) 0px 1px 2px 0px` | `--shadow-subtle-2` |
| subtle-3 | `rgba(255, 255, 255, 0.32) 0px 0.5px 0px 0px inset` | `--shadow-subtle-3` |
| subtle-4 | `rgba(0, 0, 0, 0.1) 0px 0.5px 0px 0px inset, rgba(0, 0, 0,...` | `--shadow-subtle-4` |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 64px
- **Card padding:** 16px
- **Element gap:** 8px

## Components

### Pill Primary Button
**Role:** Filled action button for primary CTAs

Full pill radius (9999px), Ink (#171717) background, white text at 14px weight 500, padding 10px 20px, subtle inset highlight shadow. Used sparingly — most pages rely on text or ghost buttons.

### Promo Pill Button
**Role:** Orange branded announcement button

Full pill radius (9999px), Sienna Brand (#451a03) background with white text, 10px 16px padding, 13px weight 500. Used only for branded announcements and launch promotions.

### Ghost Text Button
**Role:** Low-emphasis inline action

No background, Ink (#171717) text at 14px weight 500, 4px vertical / 8px horizontal padding. The default for most navigation and secondary actions.

### Product App Card
**Role:** Large product screenshot container

Pure White (#ffffff) background, 12px radius, soft layered shadow (see elevation), overflow hidden to clip the screenshot edges. The hero component — spans nearly full page width.

### Post Card
**Role:** Content card in the product feed

Pure White (#ffffff) background, 8px radius, 1px border in #f0f0f0, padding 16px, 8px gap between elements. Contains avatar, author name, timestamp, post body, and category tag.

### Status Badge
**Role:** Category or state indicator

4px radius, 4px 8px padding, 12px Inter weight 500. Green (#22c55e) background with white text for 'Resolved'. Neutral #f5f5f5 background with #737373 text for category tags like 'Product' or 'Engineering'.

### Notification Pill
**Role:** Top-of-page announcement banner

Full pill radius, Ink (#171717) background, white text at 13px weight 500, with a small dark 'NEW' tag and right-arrow icon. Centered above the hero headline.

### Sidebar Navigation
**Role:** Left rail in product mockup

Pure White (#ffffff) background, 1px right border in #f0f0f0, 240px width. Items are 10px 12px padded, 14px Inter weight 400, Ink for active, #737373 for inactive. Active item has a subtle #f5f5f5 background fill.

### Quote Callout
**Role:** Customer testimonial block

Highlight Wash (#fef3c7) background, 8px radius, 16px padding. Quote text in Ink at 16px weight 400, attribution below in #525252 at 13px with avatar.

### Feature Card
**Role:** Product capability showcase

Pure White (#ffffff) background, 12px radius, 1px border in #f0f0f0, padding 20px. Pairs a small product UI mockup (left) with a heading and description (right) in a 2-column layout.

### Input Field
**Role:** Text input for post composer

Ash Mist (#f5f5f5) background, 8px radius, 12px padding, 1px border in #f0f0f0. Placeholder text in #a3a3a3 at 14px weight 400. A 'Post' submit button sits flush right.

### Avatar
**Role:** User identification

Full circle (9999px radius), 24px or 32px diameter, with a 1px border in #ffffff to separate from backgrounds. Initials or photo fill.

### Logo Mark
**Role:** Brand identity

Rounded square (8px radius) with Sienna Brand (#451a03) background and white geometric mark. 32px in the header, 24px in the favicon.

## Do's and Don'ts

### Do
- Use Inter weight 400 for body, 500 for UI labels, 600 for headings — never go below 400 or above 600
- Apply -1.8px letter-spacing at 58px display size and scale proportionally down to -0.27px at 15px body
- Use 9999px radius for all buttons, tags, and avatars — pill shapes are the system's identity
- Keep the canvas at #fffdf9 (warm white) — never use pure #ffffff for page backgrounds, only for cards and elevated surfaces
- Use the layered 5% opacity shadow stack for product cards and the stronger multi-stop shadow only for the hero product mockup
- Limit color to functional roles: green for resolved, #fef3c7 for highlights, #ef4444 for destructive — everything else stays monochrome
- Space sections at 64px with 8px element gaps and 16px card padding — the 4px base unit keeps everything snap-aligned

### Don't
- Don't introduce a second typeface — Inter alone carries the entire hierarchy
- Don't use heavy drop shadows, colored shadows, or shadows with more than 10% opacity
- Don't use sharp corners (0px radius) on any interactive element — minimum 8px, prefer pill
- Don't apply Sienna Brand (#451a03) to text body or list items — it's decorative branding only
- Don't add gradients, glassmorphism, or neumorphism — surfaces are flat with hairline borders
- Don't use pure black (#000000) for text — use #171717 for warmth
- Don't exceed 58px for display headings or go below 11px for any text — the scale is intentionally tight

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Warm Canvas | `#fffdf9` | Base page background |
| 1 | Pure White | `#ffffff` | Cards, product screenshots, and primary elevated surfaces |
| 2 | Ash Mist | `#f5f5f5` | Nested content blocks, post bodies, subtle panel fills |
| 3 | Soft Fog | `#f0f0f0` | Dividers, inactive state backgrounds, tag fills |

## Elevation

- **Product cards and elevated panels:** `rgba(0, 0, 0, 0.05) 0px 3px 6px -3px, rgba(0, 0, 0, 0.05) 0px 2px 4px -2px, rgba(0, 0, 0, 0.05) 0px 1px 2px -1px`
- **Buttons and interactive controls:** `rgba(0, 0, 0, 0.08) 0px 1px 1px -1px, rgba(0, 0, 0, 0.08) 0px 2px 2px -1px, rgba(0, 0, 0, 0.06) 0px 0px 0px 1px, inset 0 1px 0 rgba(255,255,255,0.32)`
- **Floating product mockup (hero):** `rgba(0, 0, 0, 0.1) 0px 0.5px 0px 0px inset, rgba(0, 0, 0, 0.1) 0px 2px 4px 0px, rgba(0, 0, 0, 0.1) 0px 4px 12px 0px, rgba(0, 0, 0, 0.02) 0px 8px 20px 0px`

## Imagery

The site is product-screenshot dominant. The hero features a large, full-bleed macOS-style app window with traffic-light controls, a left sidebar, and a messaging feed. These product mockups are the primary visual — they span nearly the full content width and carry the most visual weight. Decorative orange paint-splash illustrations frame the left and right edges of the page, adding organic warmth to the otherwise precise grid. No photography, no stock imagery, no abstract graphics — the product UI IS the imagery. Icons within the product are small, filled, and monochrome (Ink or #737373).

## Layout

Centered max-width (~1200px) container with the hero headline centered over the product mockup. The product mockup is the dominant element — full-width, slightly overlapping the content boundary. Below the fold, content alternates between centered headline + description stacks and 2-column feature blocks (product mockup left, text right). The sidebar paint-splash decorations bleed off the left and right edges of the viewport, creating a frame around the centered content. Vertical rhythm is 64px between sections, with generous breathing room. Navigation is minimal: a small logo top-left, three text links top-right, no sticky header or mega-menu.

## Color Rationing

The system is 98% achromatic. Color appears only as functional punctuation: green for resolved states, a warm yellow wash for testimonial highlights, red for destructive actions, and a dark sienna for decorative brand paint-splashes. The product UI mockup is the only place where category colors live (green resolved badges, colored category icons). This rationing makes the rare color moments feel deliberate and high-signal.

## Product-as-Hero

Unlike typical SaaS sites that lead with abstract gradients or lifestyle photography, Campsite leads with a literal screenshot of its own product. The mockup is large enough to be readable, styled as a macOS app window with traffic-light controls, and presented with enough shadow to feel like a physical object on the page. This signals confidence: 'here is exactly what you get'.

## Agent Prompt Guide

primary action: #22c55e (filled action)
Create a Primary Action Button: #22c55e background, #171717 text, 9999px radius, compact pill padding. Use this filled treatment for the main CTA.

## Similar Brands

- **Linear** — Same monochrome-first approach with Inter typography, pill buttons, and the product UI as the hero — both treat their app screenshot as the primary visual
- **Notion** — Warm canvas background, minimal color palette, and compact information density — both use the page itself as a demonstration of the product's aesthetic
- **Height** — Compact task-tool layout with soft shadows, monochrome surfaces, and green for completion states — shares the 'quiet productivity tool' visual language
- **Pitch** — Product-forward hero with large UI mockup, Inter typeface, pill controls, and warm off-white canvas — both make the app screenshot the visual anchor

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-warm-canvas: #fffdf9;
  --color-pure-white: #ffffff;
  --color-ash-mist: #f5f5f5;
  --color-soft-fog: #f0f0f0;
  --color-ink: #171717;
  --color-graphite: #525252;
  --color-steel: #737373;
  --color-silver: #a3a3a3;
  --color-charcoal-card: #1e1e1e;
  --color-resolve-green: #22c55e;
  --color-highlight-wash: #fef3c7;
  --color-sienna-brand: #451a03;
  --color-alert-red: #ef4444;

  /* Typography — Font Families */
  --font-inter: 'Inter', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-ui-monospace: 'ui-monospace', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  --font-emoji: 'emoji', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 11px;
  --leading-caption: 1.4;
  --text-body: 15px;
  --leading-body: 1.56;
  --tracking-body: -0.27px;
  --text-body-lg: 18px;
  --leading-body-lg: 1.63;
  --text-subheading: 22px;
  --leading-subheading: 1.4;
  --text-heading: 29px;
  --leading-heading: 1.33;
  --tracking-heading: -0.52px;
  --text-display: 58px;
  --leading-display: 1.2;
  --tracking-display: -1.8px;

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
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-48: 48px;
  --spacing-64: 64px;
  --spacing-72: 72px;
  --spacing-80: 80px;
  --spacing-96: 96px;
  --spacing-160: 160px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 64px;
  --card-padding: 16px;
  --element-gap: 8px;

  /* Border Radius */
  --radius-md: 4px;
  --radius-lg: 8px;
  --radius-xl: 12px;
  --radius-2xl: 18px;
  --radius-full: 9999px;

  /* Named Radii */
  --radius-tags: 9999px;
  --radius-cards: 12px;
  --radius-images: 8px;
  --radius-inputs: 8px;
  --radius-avatars: 9999px;
  --radius-buttons: 9999px;

  /* Shadows */
  --shadow-sm: rgba(0, 0, 0, 0.05) 0px 3px 6px -3px, rgba(0, 0, 0, 0.05) 0px 2px 4px -2px, rgba(0, 0, 0, 0.05) 0px 1px 2px -1px, rgba(0, 0, 0, 0.05) 0px 1px 1px -1px, rgba(0, 0, 0, 0.05) 0px 1px 0px -1px;
  --shadow-subtle: rgba(0, 0, 0, 0.08) 0px 1px 1px -1px, rgba(0, 0, 0, 0.08) 0px 2px 2px -1px, rgba(0, 0, 0, 0.06) 0px 0px 0px 1px, rgb(255, 255, 255) 0px 1px 0px 0px inset, rgb(255, 255, 255) 0px 1px 2px 1px inset, rgba(0, 0, 0, 0.06) 0px 1px 2px 0px inset;
  --shadow-subtle-2: rgba(0, 0, 0, 0.05) 0px 1px 2px 0px;
  --shadow-subtle-3: rgba(255, 255, 255, 0.32) 0px 0.5px 0px 0px inset;
  --shadow-subtle-4: rgba(0, 0, 0, 0.1) 0px 0.5px 0px 0px inset, rgba(0, 0, 0, 0.1) 0px 2px 4px 0px, rgba(0, 0, 0, 0.1) 0px 4px 12px 0px, rgba(0, 0, 0, 0.02) 0px 8px 20px 0px;

  /* Surfaces */
  --surface-warm-canvas: #fffdf9;
  --surface-pure-white: #ffffff;
  --surface-ash-mist: #f5f5f5;
  --surface-soft-fog: #f0f0f0;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-warm-canvas: #fffdf9;
  --color-pure-white: #ffffff;
  --color-ash-mist: #f5f5f5;
  --color-soft-fog: #f0f0f0;
  --color-ink: #171717;
  --color-graphite: #525252;
  --color-steel: #737373;
  --color-silver: #a3a3a3;
  --color-charcoal-card: #1e1e1e;
  --color-resolve-green: #22c55e;
  --color-highlight-wash: #fef3c7;
  --color-sienna-brand: #451a03;
  --color-alert-red: #ef4444;

  /* Typography */
  --font-inter: 'Inter', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-ui-monospace: 'ui-monospace', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  --font-emoji: 'emoji', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 11px;
  --leading-caption: 1.4;
  --text-body: 15px;
  --leading-body: 1.56;
  --tracking-body: -0.27px;
  --text-body-lg: 18px;
  --leading-body-lg: 1.63;
  --text-subheading: 22px;
  --leading-subheading: 1.4;
  --text-heading: 29px;
  --leading-heading: 1.33;
  --tracking-heading: -0.52px;
  --text-display: 58px;
  --leading-display: 1.2;
  --tracking-display: -1.8px;

  /* Spacing */
  --spacing-4: 4px;
  --spacing-8: 8px;
  --spacing-12: 12px;
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-48: 48px;
  --spacing-64: 64px;
  --spacing-72: 72px;
  --spacing-80: 80px;
  --spacing-96: 96px;
  --spacing-160: 160px;

  /* Border Radius */
  --radius-md: 4px;
  --radius-lg: 8px;
  --radius-xl: 12px;
  --radius-2xl: 18px;
  --radius-full: 9999px;

  /* Shadows */
  --shadow-sm: rgba(0, 0, 0, 0.05) 0px 3px 6px -3px, rgba(0, 0, 0, 0.05) 0px 2px 4px -2px, rgba(0, 0, 0, 0.05) 0px 1px 2px -1px, rgba(0, 0, 0, 0.05) 0px 1px 1px -1px, rgba(0, 0, 0, 0.05) 0px 1px 0px -1px;
  --shadow-subtle: rgba(0, 0, 0, 0.08) 0px 1px 1px -1px, rgba(0, 0, 0, 0.08) 0px 2px 2px -1px, rgba(0, 0, 0, 0.06) 0px 0px 0px 1px, rgb(255, 255, 255) 0px 1px 0px 0px inset, rgb(255, 255, 255) 0px 1px 2px 1px inset, rgba(0, 0, 0, 0.06) 0px 1px 2px 0px inset;
  --shadow-subtle-2: rgba(0, 0, 0, 0.05) 0px 1px 2px 0px;
  --shadow-subtle-3: rgba(255, 255, 255, 0.32) 0px 0.5px 0px 0px inset;
  --shadow-subtle-4: rgba(0, 0, 0, 0.1) 0px 0.5px 0px 0px inset, rgba(0, 0, 0, 0.1) 0px 2px 4px 0px, rgba(0, 0, 0, 0.1) 0px 4px 12px 0px, rgba(0, 0, 0, 0.02) 0px 8px 20px 0px;
}
```
